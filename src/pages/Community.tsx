import { useEffect, useMemo, useState } from "react";
import { BellDot, MessageSquareText, Plus, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, ScrollSurface, SiteContainer } from "@/components/site/SitePrimitives";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import type { Tables } from "@/services/supabase/database.types";
import { useTranslation } from "react-i18next";

type CommunityGroup = Tables<"community_groups">;
type CommunityPost = Tables<"community_posts">;
type CommunityMessage = Tables<"community_messages">;

const READ_KEY = "bizhive.community.read";

const Community = () => {
  const { t } = useTranslation();
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
          toast({ title: "New community reply", description: newMessage.content.slice(0, 80) });
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
  }, [selectedGroup?.id]);

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
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
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
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
      return;
    }

    setComposer("");
  };

  return (
    <div className="page-shell">
      <SiteContainer className="page-stack">
        <PageHeader
          eyebrow={t("community.eyebrow")}
          title={t("community.title")}
          description={t("community.description")}
          actions={
            <Dialog open={newTopicOpen} onOpenChange={setNewTopicOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 rounded-2xl px-5">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("community.newTopic")}
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[28px] border-border/80 bg-card">
                <DialogHeader>
                  <DialogTitle>{t("community.newTopic")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input value={topicTitle} onChange={(event) => setTopicTitle(event.target.value)} placeholder={t("community.topicPlaceholder")} className="h-12 rounded-2xl" />
                  <Textarea value={topicBody} onChange={(event) => setTopicBody(event.target.value)} placeholder="Write the context, question, and what kind of help you need." className="min-h-[180px] rounded-2xl" />
                  <Button className="h-12 w-full rounded-2xl" onClick={createTopic}>
                    Publish topic
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          }
        />

        <section className="grid gap-5 xl:grid-cols-[280px_360px_minmax(0,1fr)]">
          <ScrollSurface className="lg:h-[38rem]">
            <div className="space-y-3 compact-scroll">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search rooms and topics" className="h-12 rounded-2xl pl-11" />
              </div>
              {filteredGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`rounded-2xl border px-4 py-4 text-left ${
                    selectedGroupId === group.id ? "border-primary/40 bg-primary/10" : "border-border/80 bg-muted/35"
                  }`}
                >
                  <div className="font-semibold text-foreground">{group.name}</div>
                  <div className="mt-1 text-sm leading-6 text-muted-foreground">{group.description}</div>
                </button>
              ))}
            </div>
          </ScrollSurface>

          <ScrollSurface className="lg:h-[38rem]">
            <div className="space-y-3 compact-scroll">
              {groupPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => setSelectedPostId(post.id)}
                  className={`rounded-2xl border px-4 py-4 text-left ${
                    selectedPostId === post.id ? "border-foreground bg-foreground text-background" : "border-border/80 bg-muted/35"
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
                  <div className={`mt-2 text-sm leading-6 ${selectedPostId === post.id ? "text-background/80" : "text-muted-foreground"}`}>
                    {post.content.slice(0, 120)}
                  </div>
                </button>
              ))}
            </div>
          </ScrollSurface>

          <ScrollSurface className="lg:h-[38rem]">
            <div className="flex h-full min-h-0 flex-col gap-4">
              <div className="border-b border-border/80 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
                      {selectedPost?.title || "Choose a discussion"}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{selectedPost?.author_name || t("community.signInPrompt")}</div>
                  </div>
                  {selectedPost ? <BellDot className="h-5 w-5 text-primary" /> : null}
                </div>
              </div>

              <div className="compact-scroll flex-1 space-y-3">
                {selectedPost ? (
                  <>
                    <div className="rounded-2xl border border-border/80 bg-muted/35 p-4">
                      <div className="text-sm leading-7 text-foreground">{selectedPost.content}</div>
                    </div>
                    {threadMessages.map((message) => (
                      <div key={message.id} className={`rounded-2xl p-4 ${message.user_id === user?.id ? "bg-foreground text-background" : "border border-border/80 bg-muted/35"}`}>
                        <div className={`text-xs font-semibold uppercase tracking-[0.14em] ${message.user_id === user?.id ? "text-background/70" : "text-muted-foreground"}`}>
                          {message.user_name || "Member"}
                        </div>
                        <div className="mt-2 text-sm leading-7">{message.content}</div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="panel-muted flex min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
                    <MessageSquareText className="h-6 w-6 text-primary" />
                    <div className="text-lg font-semibold text-foreground">Choose a discussion</div>
                    <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                      Select a room and a topic to read the thread and send replies with the single composer below.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-border/80 pt-4">
                <div className="flex gap-3">
                  <Textarea
                    value={composer}
                    onChange={(event) => setComposer(event.target.value)}
                    placeholder={selectedPost ? t("community.replyPlaceholder") : t("community.signInPrompt")}
                    className="min-h-[88px] rounded-2xl"
                  />
                  <Button className="h-auto min-h-[88px] rounded-2xl px-4" onClick={sendReply}>
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
