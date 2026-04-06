import { useEffect, useMemo, useState } from "react";
import { BellDot, Lock, MessageSquareText, Plus, Search, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClayGraphic } from "@/components/ClayGraphic";
import { PageHeader, ScrollSurface, SiteContainer, Surface } from "@/components/site/SitePrimitives";
import { PremiumModal } from "@/components/PremiumModal";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import type { Tables } from "@/services/supabase/database.types";

type CommunityGroup = Tables<"community_groups">;
type CommunityPost = Tables<"community_posts">;
type CommunityMessage = Tables<"community_messages">;

const READ_KEY = "bizhive.community.read";

const Community = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [search, setSearch] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedPostId, setSelectedPostId] = useState("");
  const [composer, setComposer] = useState("");
  const [topicTitle, setTopicTitle] = useState("");
  const [topicBody, setTopicBody] = useState("");
  const [newTopicOpen, setNewTopicOpen] = useState(false);
  const [readState, setReadState] = useState<Record<string, string>>({});

  useEffect(() => {
    const persisted = window.localStorage.getItem(READ_KEY);
    setReadState(persisted ? JSON.parse(persisted) : {});
  }, []);

  const persistReadState = (nextState: Record<string, string>) => {
    setReadState(nextState);
    window.localStorage.setItem(READ_KEY, JSON.stringify(nextState));
  };

  const fetchData = async () => {
    const [groupRes, postRes, messageRes] = await Promise.all([
      supabase.from("community_groups").select("*").order("created_at", { ascending: true }),
      supabase.from("community_posts").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("community_messages").select("*").order("created_at", { ascending: true }),
    ]);

    const nextGroups = groupRes.data ?? [];
    const nextPosts = postRes.data ?? [];
    const nextMessages = messageRes.data ?? [];
    setGroups(nextGroups);
    setPosts(nextPosts);
    setMessages(nextMessages);

    if (!selectedGroupId && nextGroups[0]) {
      setSelectedGroupId(nextGroups[0].id);
    }
  };

  useEffect(() => {
    void fetchData();

    const channel = supabase
      .channel("community-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_groups" }, () => void fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => void fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "community_messages" }, (payload) => {
        void fetchData();
        const newMessage = payload.new as CommunityMessage | undefined;
        if (newMessage && newMessage.user_id !== user?.id) {
          toast({ title: "New reply", description: newMessage.content.slice(0, 88) });
        }
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return groups;
    return groups.filter((group) =>
      [group.name, group.description || "", group.slug].join(" ").toLowerCase().includes(query)
    );
  }, [groups, search]);

  const selectedGroup = filteredGroups.find((group) => group.id === selectedGroupId) ?? filteredGroups[0] ?? null;

  useEffect(() => {
    if (selectedGroup && selectedGroup.id !== selectedGroupId) {
      setSelectedGroupId(selectedGroup.id);
    }
  }, [selectedGroup?.id, selectedGroupId]);

  const groupPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesGroup = selectedGroup ? post.group_id === selectedGroup.id : true;
      const matchesSearch = !query || [post.title, post.content, post.author_name || ""].join(" ").toLowerCase().includes(query);
      return matchesGroup && matchesSearch;
    });
  }, [posts, search, selectedGroup]);

  useEffect(() => {
    if (groupPosts[0] && !groupPosts.some((post) => post.id === selectedPostId)) {
      setSelectedPostId(groupPosts[0].id);
    }
  }, [groupPosts, selectedPostId]);

  const selectedPost = groupPosts.find((post) => post.id === selectedPostId) ?? null;

  const threadMessages = useMemo(
    () => messages.filter((message) => message.post_id === selectedPostId),
    [messages, selectedPostId]
  );

  useEffect(() => {
    if (!selectedPostId) {
      return;
    }

    const latest = threadMessages[threadMessages.length - 1]?.created_at || selectedPost?.created_at || new Date().toISOString();
    if (readState[selectedPostId] === latest) {
      return;
    }
    const nextState = { ...readState, [selectedPostId]: latest };
    persistReadState(nextState);
  }, [readState, selectedPost?.created_at, selectedPostId, threadMessages]);

  const unreadCountByPost = useMemo(() => {
    return posts.reduce<Record<string, number>>((accumulator, post) => {
      const lastRead = readState[post.id];
      const relevantMessages = messages.filter((message) => message.post_id === post.id);
      accumulator[post.id] = relevantMessages.filter((message) => !lastRead || message.created_at > lastRead).length;
      return accumulator;
    }, {});
  }, [messages, posts, readState]);

  const createTopic = async () => {
    if (!user || !selectedGroup || !topicTitle.trim() || !topicBody.trim()) {
      toast({ title: "Missing fields", description: "Add a title and topic body first.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("community_posts").insert({
      title: topicTitle.trim(),
      content: topicBody.trim(),
      group_id: selectedGroup.id,
      author_id: user.id,
      author_name: user.user_metadata?.full_name || user.email || "BizHive member",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setTopicTitle("");
    setTopicBody("");
    setNewTopicOpen(false);
  };

  const sendReply = async () => {
    if (!user || !selectedPost || !composer.trim()) {
      toast({ title: "Reply not sent", description: "Select a discussion and write a reply first.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("community_messages").insert({
      post_id: selectedPost.id,
      content: composer.trim(),
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email || "BizHive member",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setComposer("");
  };

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow="Community"
          title="Discuss startup questions in one clear threaded space"
          description="Rooms, topics, and replies now have one consistent structure. You should always know whether you are browsing a room, opening a discussion, or replying to one."
          icon={MessageSquareText}
          visual={<ClayGraphic className="h-full min-h-[240px]" compact />}
          actions={
            <>
              <Dialog open={newTopicOpen} onOpenChange={setNewTopicOpen}>
                <DialogTrigger asChild>
                  <Button className="h-12 rounded-2xl px-5">
                    <Plus className="mr-2 h-4 w-4" />
                    Start a topic
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[28px] border-border/80 bg-card">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl tracking-[-0.04em]">Start a topic</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input value={topicTitle} onChange={(event) => setTopicTitle(event.target.value)} placeholder="What do you want help with?" className="h-12 rounded-[22px]" />
                    <Textarea value={topicBody} onChange={(event) => setTopicBody(event.target.value)} placeholder="Add the business context, your current challenge, and what kind of help you want from the room." className="min-h-[180px] rounded-[22px]" />
                    <Button className="h-12 w-full rounded-2xl" onClick={createTopic}>
                      Publish topic
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <PremiumModal
                trigger={
                  <Button variant="ghost" className="glass-button h-12">
                    <Lock className="mr-2 h-4 w-4 text-primary" />
                    Private channels
                  </Button>
                }
              />
            </>
          }
        />

        <section className="grid gap-4 xl:grid-cols-[280px_360px_minmax(0,1fr)]">
          <ScrollSurface className="lg:h-[48rem]">
            <div className="compact-scroll space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search rooms and discussions" className="h-12 rounded-[22px] pl-11" />
              </div>
              {filteredGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`rounded-[24px] border px-4 py-4 text-left ${
                    selectedGroupId === group.id ? "border-primary/30 bg-primary/10" : "border-border/70 bg-muted/35"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-foreground">{group.name}</div>
                    {group.is_private ? (
                      <span className="rounded-full bg-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-background">
                        Premium
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{group.description}</p>
                </button>
              ))}
            </div>
          </ScrollSurface>

          <ScrollSurface className="lg:h-[48rem]">
            <div className="compact-scroll space-y-3">
              {groupPosts.length ? (
                groupPosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setSelectedPostId(post.id)}
                    className={`rounded-[24px] border px-4 py-4 text-left ${
                      selectedPostId === post.id ? "border-foreground bg-foreground text-background" : "border-border/70 bg-muted/35"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold">{post.title}</div>
                      {unreadCountByPost[post.id] ? (
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${selectedPostId === post.id ? "bg-background/20 text-background" : "bg-primary/10 text-primary"}`}>
                          {unreadCountByPost[post.id]} new
                        </span>
                      ) : null}
                    </div>
                    <div className={`mt-2 line-clamp-3 text-sm leading-7 ${selectedPostId === post.id ? "text-background/82" : "text-muted-foreground"}`}>
                      {post.content}
                    </div>
                  </button>
                ))
              ) : (
                <div className="panel-muted p-4 text-sm leading-7 text-muted-foreground">
                  No topics match the current search in this room yet.
                </div>
              )}
            </div>
          </ScrollSurface>

          <ScrollSurface className="lg:h-[48rem]">
            <div className="flex h-full min-h-0 flex-col gap-4">
              <div className="rounded-[24px] border border-border/70 bg-muted/35 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                      {selectedPost?.title || "Choose a discussion"}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{selectedPost?.author_name || "Read a thread or start one from the room you select."}</div>
                  </div>
                  {selectedPost ? <BellDot className="h-5 w-5 text-primary" /> : null}
                </div>
                {selectedGroup?.is_private ? (
                  <div className="mt-4 rounded-[20px] border border-primary/20 bg-primary/10 px-4 py-3 text-sm leading-6 text-foreground">
                    This room is marked as a private-channel preview. The premium layer will add deeper access rules later without changing the current structure.
                  </div>
                ) : null}
              </div>

              <div className="compact-scroll flex-1 space-y-3">
                {selectedPost ? (
                  <>
                    <div data-bee-selection="disabled" className="rounded-[24px] border border-border/70 bg-muted/35 p-4">
                      <p className="text-sm leading-8 text-foreground">{selectedPost.content}</p>
                    </div>
                    {threadMessages.map((message) => (
                      <div key={message.id} data-bee-selection="disabled" className={message.user_id === user?.id ? "ml-auto max-w-[86%] rounded-[24px] bg-primary px-5 py-4 text-primary-foreground" : "rounded-[24px] border border-border/70 bg-muted/35 p-4"}>
                        <div className={message.user_id === user?.id ? "text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/74" : "text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"}>
                          {message.user_name || "Member"}
                        </div>
                        <div className="mt-2 text-sm leading-8">{message.content}</div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="panel-muted flex min-h-[260px] flex-col items-center justify-center gap-3 p-6 text-center">
                    <MessageSquareText className="h-6 w-6 text-primary" />
                    <div className="text-lg font-semibold text-foreground">Choose a discussion</div>
                    <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                      Pick a room, open a topic, and then use the single reply composer below to stay in one clean thread flow.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-[24px] border border-border/70 bg-card/80 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Reply composer
                </div>
                <div className="flex gap-3">
                  <Textarea
                    value={composer}
                    onChange={(event) => setComposer(event.target.value)}
                    placeholder={selectedPost ? "Write one thoughtful reply to the current discussion." : "Choose a discussion before replying."}
                    className="min-h-[100px] rounded-[22px]"
                  />
                  <Button className="h-auto min-h-[100px] rounded-[22px] px-4" onClick={sendReply}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </ScrollSurface>
        </section>
      </SiteContainer>
    </div>
  );
};

export default Community;
