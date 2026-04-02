import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Gavel, Lightbulb, MessageSquare, Rocket, Workflow } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import type { Tables } from "@/services/supabase/database.types";

type CommunityGroup = Tables<"community_groups">;
type CommunityPost = Tables<"community_posts">;
type CommunityMessage = Tables<"community_messages">;

type TopicMeta = {
  accent: string;
  icon: typeof Lightbulb;
  starterPrompt: string;
  summary: string;
};

const topicMetaBySlug: Record<string, TopicMeta> = {
  "general-founders": {
    icon: Lightbulb,
    accent: "from-amber-500 to-orange-500",
    starterPrompt: "Share the founder challenge or decision you want help with.",
    summary: "Validation, founder mindset, hiring calls, and operator-to-operator support.",
  },
  "funding-pitching": {
    icon: Rocket,
    accent: "from-sky-500 to-indigo-500",
    starterPrompt: "Ask for pitch feedback, diligence prep help, or investor outreach advice.",
    summary: "Fundraising prep, investor conversations, decks, and traction framing.",
  },
  "marketing-growth": {
    icon: Flame,
    accent: "from-rose-500 to-pink-500",
    starterPrompt: "Post a growth experiment, channel question, or retention problem to unpack.",
    summary: "Acquisition, content, retention, funnels, and channel strategy.",
  },
  "legal-compliance": {
    icon: Gavel,
    accent: "from-emerald-500 to-teal-500",
    starterPrompt: "Describe the legal or compliance workflow you need clarity on.",
    summary: "Contracts, filings, GST, registrations, and risk-reduction workflows.",
  },
  "product-operations": {
    icon: Workflow,
    accent: "from-violet-500 to-fuchsia-500",
    starterPrompt: "Outline the execution bottleneck, product tradeoff, or systems gap you want to solve.",
    summary: "Product priorities, team rituals, delivery systems, and process design.",
  },
};

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const getInitials = (value: string | null) => {
  if (!value) {
    return "BH";
  }

  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const Community = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedPostId, setSelectedPostId] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCommunity = useCallback(async () => {
    setLoading(true);

    const [groupsRes, postsRes, messagesRes] = await Promise.all([
      supabase.from("community_groups").select("*").order("created_at", { ascending: true }),
      supabase
        .from("community_posts")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("community_messages").select("*").order("created_at", { ascending: true }),
    ]);

    const nextGroups = groupsRes.data ?? [];
    const nextPosts = postsRes.data ?? [];
    const nextMessages = messagesRes.data ?? [];

    setGroups(nextGroups);
    setPosts(nextPosts);
    setMessages(nextMessages);

    if (!selectedGroupId && nextGroups[0]) {
      setSelectedGroupId(nextGroups[0].id);
    }

    setLoading(false);
  }, [selectedGroupId]);

  useEffect(() => {
    void fetchCommunity();

    const channel = supabase
      .channel("public:community")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_groups" }, () => void fetchCommunity())
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => void fetchCommunity())
      .on("postgres_changes", { event: "*", schema: "public", table: "community_messages" }, () => void fetchCommunity())
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchCommunity]);

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) ?? groups[0] ?? null,
    [groups, selectedGroupId]
  );

  const filteredPosts = useMemo(() => {
    if (!selectedGroup) {
      return [];
    }

    return posts.filter((post) => post.group_id === selectedGroup.id);
  }, [posts, selectedGroup]);

  useEffect(() => {
    if (!filteredPosts.length) {
      setSelectedPostId("");
      return;
    }

    if (!filteredPosts.some((post) => post.id === selectedPostId)) {
      setSelectedPostId(filteredPosts[0].id);
    }
  }, [filteredPosts, selectedPostId]);

  const selectedPost = useMemo(
    () => filteredPosts.find((post) => post.id === selectedPostId) ?? null,
    [filteredPosts, selectedPostId]
  );

  const postMessages = useMemo(
    () => messages.filter((message) => message.post_id === selectedPostId),
    [messages, selectedPostId]
  );

  const messageCountByPost = useMemo(() => {
    return messages.reduce<Record<string, number>>((accumulator, message) => {
      accumulator[message.post_id] = (accumulator[message.post_id] || 0) + 1;
      return accumulator;
    }, {});
  }, [messages]);

  const statsByGroup = useMemo(() => {
    return groups.reduce<Record<string, { posts: number; messages: number }>>((accumulator, group) => {
      const groupPosts = posts.filter((post) => post.group_id === group.id);
      accumulator[group.id] = {
        posts: groupPosts.length,
        messages: groupPosts.reduce((total, post) => total + (messageCountByPost[post.id] || 0), 0),
      };
      return accumulator;
    }, {});
  }, [groups, messageCountByPost, posts]);

  const createPost = async () => {
    if (!user) {
      toast({ title: "Login required", description: "Sign in to post in the community.", variant: "destructive" });
      return;
    }

    if (!selectedGroup || !postTitle.trim() || !postContent.trim()) {
      return;
    }

    const { data, error } = await supabase
      .from("community_posts")
      .insert({
        title: postTitle.trim(),
        content: postContent.trim(),
        category: selectedGroup.slug,
        group_id: selectedGroup.id,
        author_id: user.id,
        author_name: user.user_metadata?.full_name || user.email || "Member",
      })
      .select("*")
      .single();

    if (error) {
      toast({ title: "Could not create discussion", description: error.message, variant: "destructive" });
      return;
    }

    setPostTitle("");
    setPostContent("");
    setSelectedPostId(data.id);
    toast({ title: "Discussion created", description: "Your topic is live in the room." });
  };

  const sendReply = async () => {
    if (!user) {
      toast({ title: "Login required", description: "Sign in to reply.", variant: "destructive" });
      return;
    }

    if (!selectedPostId || !replyContent.trim()) {
      return;
    }

    const { error } = await supabase.from("community_messages").insert({
      post_id: selectedPostId,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email || "Member",
      content: replyContent.trim(),
    });

    if (error) {
      toast({ title: "Could not send reply", description: error.message, variant: "destructive" });
      return;
    }

    setReplyContent("");
  };

  const activeTopicMeta = selectedGroup ? topicMetaBySlug[selectedGroup.slug] : null;
  const ActiveIcon = activeTopicMeta?.icon || MessageSquare;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto space-y-10 px-4 py-12">
        <div className="text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent">
            <MessageSquare className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold text-foreground">Community Rooms</h1>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-muted-foreground">
            Join one of five focused founder rooms, open a discussion, and keep the conversation moving in real time.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {groups.map((group) => {
            const meta = topicMetaBySlug[group.slug] || topicMetaBySlug["general-founders"];
            const Icon = meta.icon;
            const groupStats = statsByGroup[group.id] || { posts: 0, messages: 0 };
            const isActive = selectedGroup?.id === group.id;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedGroupId(group.id)}
                className={`rounded-3xl border p-5 text-left transition-all ${
                  isActive ? "border-primary bg-primary/5 shadow-lg" : "border-border/70 bg-card hover:-translate-y-1 hover:shadow-md"
                }`}
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${meta.accent} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{group.name}</h2>
                    <Badge variant={isActive ? "default" : "secondary"}>{groupStats.posts}</Badge>
                  </div>
                  <p className="min-h-[56px] text-sm leading-6 text-muted-foreground">{group.description || meta.summary}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{groupStats.messages} replies</span>
                  <span>{group.is_private ? "Private" : "Open room"}</span>
                </div>
              </button>
            );
          })}
        </section>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>{selectedGroup?.name || "Choose a room"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {selectedGroup ? (
                <>
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${activeTopicMeta?.accent || "from-primary to-accent"} text-white`}>
                    <ActiveIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm leading-6 text-muted-foreground">{selectedGroup.description || activeTopicMeta?.summary}</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-border/70 bg-muted/40 p-3">
                        <div className="text-2xl font-bold text-foreground">{statsByGroup[selectedGroup.id]?.posts || 0}</div>
                        <div className="text-muted-foreground">Active discussions</div>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-muted/40 p-3">
                        <div className="text-2xl font-bold text-foreground">{statsByGroup[selectedGroup.id]?.messages || 0}</div>
                        <div className="text-muted-foreground">Live replies</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-border/70 p-4 text-sm leading-6 text-muted-foreground">
                    {activeTopicMeta?.starterPrompt}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Pick a room to view its discussion feed.</p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Start a discussion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder={selectedGroup ? `New topic for ${selectedGroup.name}` : "Discussion title"}
                  value={postTitle}
                  onChange={(event) => setPostTitle(event.target.value)}
                />
                <Textarea
                  placeholder={activeTopicMeta?.starterPrompt || "What do you want to discuss?"}
                  className="min-h-[140px]"
                  value={postContent}
                  onChange={(event) => setPostContent(event.target.value)}
                />
                <Button onClick={createPost} disabled={!selectedGroup}>Post to room</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topic threads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">Loading community rooms...</div>
                ) : filteredPosts.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <MessageSquare className="mx-auto mb-2 h-10 w-10 opacity-20" />
                    <p>No discussions yet in this room. Start the first one.</p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => setSelectedPostId(post.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                        selectedPostId === post.id ? "border-primary bg-primary/5" : "border-border/70 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-foreground">{post.title}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {post.author_name || "Member"} · {formatTimestamp(post.created_at)}
                          </div>
                        </div>
                        <Badge variant={post.pinned ? "default" : "secondary"}>{messageCountByPost[post.id] || 0}</Badge>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{post.content}</p>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{selectedPost?.title || "Live thread"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPost ? (
                <>
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(selectedPost.author_name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-foreground">{selectedPost.author_name || "Member"}</div>
                        <div className="text-xs text-muted-foreground">Started {formatTimestamp(selectedPost.created_at)}</div>
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-foreground">{selectedPost.content}</p>
                  </div>

                  <div className="max-h-[360px] space-y-3 overflow-auto rounded-2xl border border-border/70 p-3">
                    {postMessages.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No replies yet. Be the first to respond.</p>
                    ) : (
                      postMessages.map((message) => (
                        <div key={message.id} className="rounded-2xl bg-muted/40 p-3">
                          <div className="mb-2 flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>{getInitials(message.user_name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium text-foreground">{message.user_name || "Member"}</div>
                              <div className="text-xs text-muted-foreground">{formatTimestamp(message.created_at)}</div>
                            </div>
                          </div>
                          <p className="text-sm leading-7 text-foreground">{message.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <Textarea
                    placeholder="Add your reply to the thread"
                    className="min-h-[120px]"
                    value={replyContent}
                    onChange={(event) => setReplyContent(event.target.value)}
                  />
                  <Button onClick={sendReply}>Send reply</Button>
                </>
              ) : (
                <div className="py-8 text-sm text-muted-foreground">Pick a discussion to open the live thread.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-muted/50">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Need direct guidance?</h2>
            <p className="max-w-2xl text-muted-foreground">
              Use Bee for a faster answer, then bring your best takeaways back into the right founder room.
            </p>
            <Button asChild className="border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              <Link to="/ai-assistant">
                Open Bee AI
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
