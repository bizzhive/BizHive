import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/text";
import { Ban, Trash2 } from "lucide-react";

interface AdminCommunityTabProps {
  groups: any[];
  posts: any[];
  messages: any[];
  onRefresh: () => Promise<void>;
  currentUserId?: string;
}

const AdminCommunityTab = ({ groups, posts, messages, onRefresh, currentUserId }: AdminCommunityTabProps) => {
  const { toast } = useToast();
  const [groupForm, setGroupForm] = useState({ name: "", slug: "", description: "", is_private: false });
  const [postForm, setPostForm] = useState({ title: "", category: "announcement", content: "", group_id: "", pinned: true });

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [posts]
  );
  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [messages]
  );

  const createGroup = async () => {
    if (!groupForm.name.trim()) return;
    const { error } = await supabase.from("community_groups").insert({
      name: groupForm.name.trim(),
      slug: slugify(groupForm.slug || groupForm.name),
      description: groupForm.description.trim() || null,
      is_private: groupForm.is_private,
    });

    if (error) {
      toast({ title: "Group creation failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Group created" });
    setGroupForm({ name: "", slug: "", description: "", is_private: false });
    await onRefresh();
  };

  const createAnnouncement = async () => {
    if (!postForm.title.trim() || !postForm.content.trim()) return;
    const { error } = await supabase.from("community_posts").insert({
      title: postForm.title.trim(),
      content: postForm.content.trim(),
      category: postForm.category.trim() || "announcement",
      group_id: postForm.group_id || null,
      pinned: postForm.pinned,
      author_id: currentUserId,
      author_name: "BizHive Team",
    });

    if (error) {
      toast({ title: "Post creation failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Community post created" });
    setPostForm({ title: "", category: "announcement", content: "", group_id: "", pinned: true });
    await onRefresh();
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("community_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Post deleted" });
    await onRefresh();
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase.from("community_messages").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Message deleted" });
    await onRefresh();
  };

  const banUser = async (userId: string) => {
    if (!userId) return;
    await supabase.from("user_bans").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_bans").insert({
      user_id: userId,
      banned_by: currentUserId ?? null,
      reason: "Community moderation action",
    });

    if (error) {
      toast({ title: "Ban failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "User banned" });
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create chat group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Group name" value={groupForm.name} onChange={(e) => setGroupForm((prev) => ({ ...prev, name: e.target.value, slug: !prev.slug ? slugify(e.target.value) : prev.slug }))} />
            <Input placeholder="Slug" value={groupForm.slug} onChange={(e) => setGroupForm((prev) => ({ ...prev, slug: e.target.value }))} />
            <Textarea placeholder="Short description" value={groupForm.description} onChange={(e) => setGroupForm((prev) => ({ ...prev, description: e.target.value }))} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={groupForm.is_private} onChange={(e) => setGroupForm((prev) => ({ ...prev, is_private: e.target.checked }))} className="h-4 w-4 rounded border-input" />
              Private group
            </label>
            <Button onClick={createGroup}>Create Group</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create admin community post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Post title" value={postForm.title} onChange={(e) => setPostForm((prev) => ({ ...prev, title: e.target.value }))} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Category" value={postForm.category} onChange={(e) => setPostForm((prev) => ({ ...prev, category: e.target.value }))} />
              <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={postForm.group_id} onChange={(e) => setPostForm((prev) => ({ ...prev, group_id: e.target.value }))}>
                <option value="">All groups</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
            <Textarea placeholder="Post content" value={postForm.content} onChange={(e) => setPostForm((prev) => ({ ...prev, content: e.target.value }))} className="min-h-[180px]" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={postForm.pinned} onChange={(e) => setPostForm((prev) => ({ ...prev, pinned: e.target.checked }))} className="h-4 w-4 rounded border-input" />
              Pin this post
            </label>
            <Button onClick={createAnnouncement}>Publish Post</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Groups ({groups.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {groups.map((group) => (
              <div key={group.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{group.name}</div>
                    <div className="text-sm text-muted-foreground">/{group.slug}</div>
                  </div>
                  <Badge variant={group.is_private ? "secondary" : "outline"}>{group.is_private ? "Private" : "Public"}</Badge>
                </div>
                {group.description && <p className="mt-2 text-sm text-muted-foreground">{group.description}</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts ({sortedPosts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[420px] overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{post.title}</div>
                          <div className="text-xs text-muted-foreground">{post.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>{post.author_name || "Unknown"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {post.author_id && (
                            <Button size="sm" variant="outline" onClick={() => banUser(post.author_id)}>
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => deletePost(post.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sortedPosts.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No posts yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All chat messages ({sortedMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[460px] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.user_name || message.user_id.slice(0, 8)}</TableCell>
                    <TableCell className="max-w-[420px] truncate">{message.content}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => banUser(message.user_id)}>
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteMessage(message.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedMessages.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No chat messages yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCommunityTab;
