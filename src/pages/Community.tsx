import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Flame,
  Gavel,
  Lightbulb,
  MessageSquare,
  Rocket,
  Search,
  Users,
  Workflow,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  EmptyState,
  PageHeader,
  SectionHeading,
  SiteContainer,
  Surface,
} from "@/components/site/SitePrimitives";
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
    starterPrompt:
      "Outline the execution bottleneck, product tradeoff, or systems gap you want to solve.",
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
  const [searchQuery, setSearchQuery] = useState("");
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
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_groups" },
        () => void fetchCommunity()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_posts" },
        () => void fetchCommunity()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_messages" },
        () => void fetchCommunity()
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchCommunity]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const visibleGroups = useMemo(() => {
    if (!normalizedQuery) {
      return groups;
    }

    return groups.filter((group) =>
      [group.name, group.description, group.slug].join(" ").toLowerCase().includes(normalizedQuery)
    );
  }, [groups, normalizedQuery]);

  const selectedGroup = useMemo(
    () => visibleGroups.find((group) => group.id === selectedGroupId) ?? visibleGroups[0] ?? null,
    [selectedGroupId, visibleGroups]
  );

  useEffect(() => {
    if (selectedGroup && selectedGroup.id !== selectedGroupId) {
      setSelectedGroupId(selectedGroup.id);
    }
  }, [selectedGroup, selectedGroupId]);

  const filteredPosts = useMemo(() => {
    if (!selectedGroup) {
      return [];
    }

    return posts.filter((post) => {
      const matchesGroup = post.group_id === selectedGroup.id;
      if (!normalizedQuery) {
        return matchesGroup;
      }

      const haystack = [post.title, post.content, post.author_name].join(" ").toLowerCase();
      return matchesGroup && haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery, posts, selectedGroup]);

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

  const postMessages = useMemo(() => {
    const relevant = messages.filter((message) => message.post_id === selectedPostId);
    if (!normalizedQuery) {
      return relevant;
    }

    return relevant.filter((message) =>
      [message.user_name, message.content].join(" ").toLowerCase().includes(normalizedQuery)
    );
  }, [messages, normalizedQuery, selectedPostId]);

  const messageCountByPost = useMemo(
    () =>
      messages.reduce<Record<string, number>>((accumulator, message) => {
        accumulator[message.post_id] = (accumulator[message.post_id] || 0) + 1;
        return accumulator;
      }, {}),
    [messages]
  );

  const statsByGroup = useMemo(
    () =>
      groups.reduce<Record<string, { posts: number; messages: number }>>((accumulator, group) => {
        const groupPosts = posts.filter((post) => post.group_id === group.id);
        accumulator[group.id] = {
          posts: groupPosts.length,
          messages: groupPosts.reduce(
            (total, post) => total + (messageCountByPost[post.id] || 0),
            0
          ),
        };
        return accumulator;
      }, {}),
    [groups, messageCountByPost, posts]
  );

  const createPost = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Sign in to post in the community.",
        variant: "destructive",
      });
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
      toast({
        title: "Could not create discussion",
        description: error.message,
        variant: "destructive",
      });
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
    <div className="page-shell">
      <SiteContainer className="space-y-8">
        <PageHeader
          eyebrow="Founder community"
          title="Topic rooms built for practical founder conversations"
          description="Browse focused rooms, search active discussions, and keep community threads aligned with the same design system as the rest of BizHive."
          actions={
            <>
              <Button asChild size="lg">
                <Link to="/dashboard">Back to dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/resources/learn">Open learning hub</Link>
              </Button>
            </>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[0.74fr_1.26fr]">
          <Surface className="space-y-5">
            <SectionHeading
              eyebrow="Community search"
              title="Filter rooms, threads, and replies"
              description="Use one search field to scan room topics, discussion titles, and message content without leaving the page."
            />

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search rooms, threads, or replies..."
                className="h-12 rounded-2xl border-border/70 bg-muted/35 pl-11"
                aria-label="Search community discussions"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Rooms", value: groups.length },
                { label: "Discussions", value: posts.length },
                { label: "Replies", value: messages.length },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] border border-border/70 bg-background/72 p-4">
                  <div className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    {item.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Room overview"
                title="A cleaner community layout with clearer room states"
                description="Rooms, threads, and live conversations now share one visual language instead of feeling like separate widgets."
              />
              <Badge className="w-fit rounded-full border-none bg-primary/10 px-3 py-1 text-primary">
                {visibleGroups.length} visible rooms
              </Badge>
            </div>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-[220px] animate-pulse rounded-[28px] bg-muted/40" />
                ))}
              </div>
            ) : visibleGroups.length === 0 ? (
              <EmptyState
                icon={<Users className="h-6 w-6" />}
                title="No matching rooms"
                description="Try a broader search term to bring the founder rooms back into view."
                action={
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Reset search
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {visibleGroups.map((group) => {
                  const meta = topicMetaBySlug[group.slug] || topicMetaBySlug["general-founders"];
                  const Icon = meta.icon;
                  const groupStats = statsByGroup[group.id] || { posts: 0, messages: 0 };
                  const isActive = selectedGroup?.id === group.id;

                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setSelectedGroupId(group.id)}
                      className={`rounded-[28px] border p-5 text-left transition-all ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border/70 bg-card hover:-translate-y-1 hover:shadow-md"
                      }`}
                    >
                      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${meta.accent} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="text-lg font-semibold text-foreground">{group.name}</h2>
                          <Badge variant={isActive ? "default" : "secondary"}>
                            {groupStats.posts}
                          </Badge>
                        </div>
                        <p className="min-h-[72px] text-sm leading-6 text-muted-foreground">
                          {group.description || meta.summary}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{groupStats.messages} replies</span>
                        <span>{group.is_private ? "Private" : "Open room"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Surface>
        </section>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr_1fr]">
          <Surface className="p-6">
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                {selectedGroup?.name || "Choose a room"}
              </h2>
              {selectedGroup ? (
                <>
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${activeTopicMeta?.accent || "from-primary to-accent"} text-white`}>
                    <ActiveIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {selectedGroup.description || activeTopicMeta?.summary}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-[22px] border border-border/70 bg-muted/40 p-3">
                        <div className="text-2xl font-bold text-foreground">
                          {statsByGroup[selectedGroup.id]?.posts || 0}
                        </div>
                        <div className="text-muted-foreground">Active discussions</div>
                      </div>
                      <div className="rounded-[22px] border border-border/70 bg-muted/40 p-3">
                        <div className="text-2xl font-bold text-foreground">
                          {statsByGroup[selectedGroup.id]?.messages || 0}
                        </div>
                        <div className="text-muted-foreground">Live replies</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-dashed border-border/70 p-4 text-sm leading-6 text-muted-foreground">
                    {activeTopicMeta?.starterPrompt}
                  </div>
                </>
              ) : (
                <EmptyState
                  className="border-dashed bg-transparent py-8 shadow-none"
                  icon={<Users className="h-5 w-5" />}
                  title="Pick a room"
                  description="Choose a founder room from the overview above to load its discussion feed."
                />
              )}
            </div>
          </Surface>

          <div className="space-y-6">
            <Surface className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    Start a discussion
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Open a new thread inside the currently selected room.
                  </p>
                </div>
                <Input
                  placeholder={selectedGroup ? `New topic for ${selectedGroup.name}` : "Discussion title"}
                  value={postTitle}
                  onChange={(event) => setPostTitle(event.target.value)}
                  className="h-12 rounded-2xl border-border/70 bg-muted/35 px-4"
                />
                <Textarea
                  placeholder={activeTopicMeta?.starterPrompt || "What do you want to discuss?"}
                  className="min-h-[140px] rounded-[24px] border-border/70 bg-muted/35"
                  value={postContent}
                  onChange={(event) => setPostContent(event.target.value)}
                />
                <Button onClick={createPost} disabled={!selectedGroup}>Post to room</Button>
              </div>
            </Surface>

            <Surface className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                      Topic threads
                    </h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Browse active threads in the selected room.
                    </p>
                  </div>
                  <Badge variant="secondary">{filteredPosts.length}</Badge>
                </div>

                {loading ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Loading community rooms...
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <EmptyState
                    className="border-dashed bg-transparent py-8 shadow-none"
                    icon={<MessageSquare className="h-5 w-5" />}
                    title="No discussions yet"
                    description={
                      selectedGroup
                        ? "Start the first discussion in this room."
                        : "Choose a room before posting."
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {filteredPosts.map((post) => (
                      <button
                        key={post.id}
                        type="button"
                        onClick={() => setSelectedPostId(post.id)}
                        className={`w-full rounded-[22px] border p-4 text-left transition-colors ${
                          selectedPostId === post.id
                            ? "border-primary bg-primary/5"
                            : "border-border/70 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-foreground">{post.title}</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {post.author_name || "Member"} · {formatTimestamp(post.created_at)}
                            </div>
                          </div>
                          <Badge variant={post.pinned ? "default" : "secondary"}>
                            {messageCountByPost[post.id] || 0}
                          </Badge>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                          {post.content}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Surface>
          </div>

          <Surface className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {selectedPost?.title || "Live thread"}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Open one thread and follow the full conversation without losing context.
                </p>
              </div>

              {selectedPost ? (
                <>
                  <div className="rounded-[22px] border border-border/70 bg-muted/30 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(selectedPost.author_name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {selectedPost.author_name || "Member"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Started {formatTimestamp(selectedPost.created_at)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-foreground">{selectedPost.content}</p>
                  </div>

                  <div className="max-h-[360px] space-y-3 overflow-auto rounded-[22px] border border-border/70 p-3">
                    {postMessages.length === 0 ? (
                      <p className="text-sm leading-6 text-muted-foreground">
                        No replies yet. Be the first to respond.
                      </p>
                    ) : (
                      postMessages.map((message) => (
                        <div key={message.id} className="rounded-[20px] bg-muted/40 p-3">
                          <div className="mb-2 flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>{getInitials(message.user_name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {message.user_name || "Member"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatTimestamp(message.created_at)}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm leading-7 text-foreground">{message.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <Textarea
                    placeholder="Add your reply to the thread"
                    className="min-h-[120px] rounded-[24px] border-border/70 bg-muted/35"
                    value={replyContent}
                    onChange={(event) => setReplyContent(event.target.value)}
                  />
                  <Button onClick={sendReply}>Send reply</Button>
                </>
              ) : (
                <EmptyState
                  className="border-dashed bg-transparent py-10 shadow-none"
                  icon={<MessageSquare className="h-5 w-5" />}
                  title="Pick a discussion"
                  description="Choose a thread from the middle column to open the live conversation."
                />
              )}
            </div>
          </Surface>
        </div>

        <Surface className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
              Turn the best community insight into action
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Pull the strongest ideas back into your dashboard, plans, and business tools so community feedback turns into real next steps.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/dashboard">
                  Open dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/tools">Explore tools</Link>
              </Button>
            </div>
          </div>
        </Surface>
      </SiteContainer>
    </div>
  );
};

export default Community;
