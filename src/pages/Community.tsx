import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Community = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [replyContent, setReplyContent] = useState("");

  const fetchCommunity = async () => {
    const [groupsRes, postsRes, messagesRes] = await Promise.all([
      supabase.from("community_groups").select("*").order("created_at", { ascending: true }),
      supabase.from("community_posts").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("community_messages").select("*").order("created_at", { ascending: true }),
    ]);

    const nextGroups = groupsRes.data ?? [];
    const nextPosts = postsRes.data ?? [];
    const nextMessages = messagesRes.data ?? [];

    setGroups(nextGroups);
    setPosts(nextPosts);
    setMessages(nextMessages);

    if (!selectedGroupId && nextGroups[0]) setSelectedGroupId(nextGroups[0].id);
    if (!selectedPostId && nextPosts[0]) setSelectedPostId(nextPosts[0].id);
  };

  useEffect(() => {
    fetchCommunity();

    // Real-time subscription for new posts and messages
    const channel = supabase
      .channel('public:community')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts' }, (payload) => {
        setPosts((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredPosts = useMemo(() => {
    if (!selectedGroupId) return posts;
    return posts.filter((post) => post.group_id === selectedGroupId);
  }, [posts, selectedGroupId]);

  useEffect(() => {
    if (filteredPosts.length > 0 && !filteredPosts.some((post) => post.id === selectedPostId)) {
      setSelectedPostId(filteredPosts[0].id);
    }
  }, [filteredPosts, selectedPostId]);

  const selectedPost = filteredPosts.find((post) => post.id === selectedPostId) ?? null;
  const postMessages = messages.filter((message) => message.post_id === selectedPostId);

  const createPost = async () => {
    if (!user) {
      toast({ title: "Login required", description: "Sign in to post in the community.", variant: "destructive" });
      return;
    }
    if (!postTitle.trim() || !postContent.trim()) return;

    const { error } = await supabase.from("community_posts").insert({
      title: postTitle.trim(),
      content: postContent.trim(),
      category: "discussion",
      group_id: selectedGroupId || null,
      author_id: user.id,
      author_name: user.user_metadata?.full_name || user.email || "Member",
    });

    if (error) {
      toast({ title: "Could not create post", description: error.message, variant: "destructive" });
      return;
    }

    setPostTitle("");
    setPostContent("");
    toast({ title: "Discussion created" });
    await fetchCommunity();
  };

  const sendReply = async () => {
    if (!user) {
      toast({ title: "Login required", description: "Sign in to reply.", variant: "destructive" });
      return;
    }
    if (!selectedPostId || !replyContent.trim()) return;

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
    await fetchCommunity();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 space-y-10">
        <div className="text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent">
            <Users className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold text-foreground">Community & Chat Groups</h1>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-muted-foreground">
            Join topic-based founder groups, create discussions, and chat inside each thread.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_1fr_1fr]">
          <Card>
            <CardHeader><CardTitle>Groups</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {groups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${selectedGroupId === group.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-foreground">{group.name}</span>
                    <Badge variant={group.is_private ? "secondary" : "outline"}>{group.is_private ? "Private" : "Public"}</Badge>
                  </div>
                  {group.description && <p className="mt-2 text-sm text-muted-foreground">{group.description}</p>}
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Start a discussion</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Discussion title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
                <Textarea placeholder="What do you want to discuss with the group?" className="min-h-[140px]" value={postContent} onChange={(e) => setPostContent(e.target.value)} />
                <Button onClick={createPost}>Post to group</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Discussions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {filteredPosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setSelectedPostId(post.id)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${selectedPostId === post.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-foreground">{post.title}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{post.author_name || "Member"}</div>
                      </div>
                      {post.pinned && <Badge>Pinned</Badge>}
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{post.content}</p>
                  </button>
                ))}
                {filteredPosts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No discussions yet. Be the first!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{selectedPost?.title || "Thread chat"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPost ? (
                <>
                  <div className="rounded-xl border bg-muted/40 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      {selectedPost.author_name || "Member"}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">{selectedPost.content}</p>
                  </div>

                  <div className="max-h-[320px] space-y-3 overflow-auto rounded-xl border p-3">
                    {postMessages.map((message) => (
                      <div key={message.id} className="rounded-lg bg-muted/50 p-3">
                        <div className="mb-1 text-xs text-muted-foreground">{message.user_name || "Member"}</div>
                        <p className="text-sm text-foreground">{message.content}</p>
                      </div>
                    ))}
                    {postMessages.length === 0 && <p className="text-sm text-muted-foreground">No replies yet.</p>}
                  </div>

                  <Textarea placeholder="Add a reply" className="min-h-[120px]" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} />
                  <Button onClick={sendReply}>Send reply</Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Choose a discussion to see the chat.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-muted/50">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Need direct guidance?</h2>
            <p className="max-w-2xl text-muted-foreground">Use Bee for faster answers, then bring the best ideas back into the community groups.</p>
            <Button asChild variant="outline"><Link to="/ai-assistant">Open Bee AI <ArrowRight className="h-4 w-4" /></Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
