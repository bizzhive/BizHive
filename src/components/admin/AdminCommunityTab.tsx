import { useEffect, useMemo, useState } from "react";
import { Ban, Trash2 } from "lucide-react";
import { slugify } from "@/lib/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import type { Json, Tables } from "@/services/supabase/database.types";

type CommunityGroup = Tables<"community_groups">;
type CommunityPost = Tables<"community_posts">;
type CommunityMessage = Tables<"community_messages">;

type AuditLogger = (entry: {
  action: string;
  details?: Json;
  entityId?: string | null;
  entityType: string;
  summary: string;
}) => Promise<void>;

interface AdminCommunityTabProps {
  canModerate?: boolean;
  currentUserId?: string;
  groups: CommunityGroup[];
  messages: CommunityMessage[];
  onAudit?: AuditLogger;
  onRefresh: () => Promise<void>;
  posts: CommunityPost[];
}

const PAGE_SIZE = 8;

const noopAudit: AuditLogger = async () => {};

const AdminCommunityTab = ({ canModerate = true, currentUserId, groups, messages, onAudit = noopAudit, onRefresh, posts }: AdminCommunityTabProps) => {
  const { toast } = useToast();
  const [groupForm, setGroupForm] = useState({ name: "", slug: "", description: "", is_private: false });
  const [postForm, setPostForm] = useState({ title: "", category: "announcement", content: "", group_id: "", pinned: true });
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [postPage, setPostPage] = useState(1);
  const [messagePage, setMessagePage] = useState(1);

  const groupCounts = useMemo(() => {
    return groups.reduce<Record<string, { posts: number; messages: number }>>((accumulator, group) => {
      const matchingPosts = posts.filter((post) => post.group_id === group.id);
      accumulator[group.id] = {
        posts: matchingPosts.length,
        messages: messages.filter((message) => matchingPosts.some((post) => post.id === message.post_id)).length,
      };
      return accumulator;
    }, {});
  }, [groups, messages, posts]);

  const filteredPosts = useMemo(() => {
    return [...posts]
      .sort((left, right) => +new Date(right.created_at) - +new Date(left.created_at))
      .filter((post) => {
        const matchesGroup = groupFilter === "all" || post.group_id === groupFilter;
        const matchesSearch =
          !search ||
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.content.toLowerCase().includes(search.toLowerCase()) ||
          (post.author_name || "").toLowerCase().includes(search.toLowerCase());
        return matchesGroup && matchesSearch;
      });
  }, [groupFilter, posts, search]);

  const filteredMessages = useMemo(() => {
    const allowedPostIds = new Set(filteredPosts.map((post) => post.id));

    return [...messages]
      .sort((left, right) => +new Date(right.created_at) - +new Date(left.created_at))
      .filter((message) => {
        const matchesSearch =
          !search ||
          message.content.toLowerCase().includes(search.toLowerCase()) ||
          (message.user_name || "").toLowerCase().includes(search.toLowerCase());
        return matchesSearch && (groupFilter === "all" || allowedPostIds.has(message.post_id));
      });
  }, [filteredPosts, groupFilter, messages, search]);

  const totalPostPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const totalMessagePages = Math.max(1, Math.ceil(filteredMessages.length / PAGE_SIZE));
  const paginatedPosts = filteredPosts.slice((postPage - 1) * PAGE_SIZE, postPage * PAGE_SIZE);
  const paginatedMessages = filteredMessages.slice((messagePage - 1) * PAGE_SIZE, messagePage * PAGE_SIZE);

  useEffect(() => {
    setPostPage(1);
    setMessagePage(1);
  }, [groupFilter, search]);

  useEffect(() => {
    if (postPage > totalPostPages) {
      setPostPage(totalPostPages);
    }
  }, [postPage, totalPostPages]);

  useEffect(() => {
    if (messagePage > totalMessagePages) {
      setMessagePage(totalMessagePages);
    }
  }, [messagePage, totalMessagePages]);

  const createGroup = async () => {
    if (!canModerate || !groupForm.name.trim()) {
      return;
    }

    const payload = {
      name: groupForm.name.trim(),
      slug: slugify(groupForm.slug || groupForm.name),
      description: groupForm.description.trim() || null,
      is_private: groupForm.is_private,
    };

    const { data, error } = await supabase.from("community_groups").insert(payload).select("id").single();
    if (error) {
      toast({ title: "Group creation failed", description: error.message, variant: "destructive" });
      return;
    }

    await onAudit({
      action: "community.group.created",
      details: payload,
      entityId: data?.id,
      entityType: "community_groups",
      summary: `Created community group \"${payload.name}\"`,
    });

    toast({ title: "Group created" });
    setGroupForm({ name: "", slug: "", description: "", is_private: false });
    await onRefresh();
  };

  const createAnnouncement = async () => {
    if (!canModerate || !postForm.title.trim() || !postForm.content.trim() || !currentUserId) {
      return;
    }

    const payload = {
      title: postForm.title.trim(),
      content: postForm.content.trim(),
      category: postForm.category.trim() || "announcement",
      group_id: postForm.group_id || null,
      pinned: postForm.pinned,
      author_id: currentUserId,
      author_name: "BizHive Team",
    };

    const { data, error } = await supabase.from("community_posts").insert(payload).select("id").single();
    if (error) {
      toast({ title: "Post creation failed", description: error.message, variant: "destructive" });
      return;
    }

    await onAudit({
      action: "community.post.created",
      details: payload,
      entityId: data?.id,
      entityType: "community_posts",
      summary: `Created community post \"${payload.title}\"`,
    });

    toast({ title: "Community post created" });
    setPostForm({ title: "", category: "announcement", content: "", group_id: "", pinned: true });
    await onRefresh();
  };

  const deletePost = async (post: CommunityPost) => {
    if (!canModerate) {
      return;
    }

    const { error } = await supabase.from("community_posts").delete().eq("id", post.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }

    await onAudit({
      action: "community.post.deleted",
      details: { title: post.title, author_name: post.author_name },
      entityId: post.id,
      entityType: "community_posts",
      summary: `Deleted community post \"${post.title}\"`,
    });

    toast({ title: "Post deleted" });
    await onRefresh();
  };

  const deleteMessage = async (message: CommunityMessage) => {
    if (!canModerate) {
      return;
    }

    const { error } = await supabase.from("community_messages").delete().eq("id", message.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }

    await onAudit({
      action: "community.message.deleted",
      details: { user_name: message.user_name, preview: message.content.slice(0, 120) },
      entityId: message.id,
      entityType: "community_messages",
      summary: `Deleted a community reply from ${message.user_name || "a member"}`,
    });

    toast({ title: "Message deleted" });
    await onRefresh();
  };

  const banUser = async (userId: string, userName?: string | null) => {
    if (!canModerate || !userId) {
      return;
    }

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

    await onAudit({
      action: "community.user.banned",
      details: { banned_user_id: userId },
      entityId: userId,
      entityType: "user_bans",
      summary: `Banned community user ${userName || userId.slice(0, 8)}`,
    });

    toast({ title: "User banned" });
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      {!canModerate && (
        <Card>
          <CardContent className="py-4 text-sm text-muted-foreground">
            Your current role can review community data, but create, delete, and ban actions are disabled.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create chat group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Group name" value={groupForm.name} onChange={(event) => setGroupForm((previous) => ({ ...previous, name: event.target.value, slug: !previous.slug ? slugify(event.target.value) : previous.slug }))} disabled={!canModerate} />
            <Input placeholder="Slug" value={groupForm.slug} onChange={(event) => setGroupForm((previous) => ({ ...previous, slug: event.target.value }))} disabled={!canModerate} />
            <Textarea placeholder="Short description" value={groupForm.description} onChange={(event) => setGroupForm((previous) => ({ ...previous, description: event.target.value }))} disabled={!canModerate} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={groupForm.is_private} onChange={(event) => setGroupForm((previous) => ({ ...previous, is_private: event.target.checked }))} className="h-4 w-4 rounded border-input" disabled={!canModerate} />
              Private group
            </label>
            <Button onClick={createGroup} disabled={!canModerate}>Create Group</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create admin community post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Post title" value={postForm.title} onChange={(event) => setPostForm((previous) => ({ ...previous, title: event.target.value }))} disabled={!canModerate} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Category" value={postForm.category} onChange={(event) => setPostForm((previous) => ({ ...previous, category: event.target.value }))} disabled={!canModerate} />
              <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={postForm.group_id} onChange={(event) => setPostForm((previous) => ({ ...previous, group_id: event.target.value }))} disabled={!canModerate}>
                <option value="">All groups</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
            <Textarea placeholder="Post content" value={postForm.content} onChange={(event) => setPostForm((previous) => ({ ...previous, content: event.target.value }))} className="min-h-[180px]" disabled={!canModerate} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={postForm.pinned} onChange={(event) => setPostForm((previous) => ({ ...previous, pinned: event.target.checked }))} className="h-4 w-4 rounded border-input" disabled={!canModerate} />
              Pin this post
            </label>
            <Button onClick={createAnnouncement} disabled={!canModerate}>Publish Post</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Community filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_220px]">
          <Input placeholder="Search posts, replies, or member names..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)}>
            <option value="all">All groups</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </CardContent>
      </Card>

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
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{groupCounts[group.id]?.posts || 0} posts</span>
                  <span>{groupCounts[group.id]?.messages || 0} replies</span>
                </div>
                {group.description && <p className="mt-2 text-sm text-muted-foreground">{group.description}</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts ({filteredPosts.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  {paginatedPosts.map((post) => (
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
                            <Button size="sm" variant="outline" onClick={() => banUser(post.author_id, post.author_name)} disabled={!canModerate}>
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => deletePost(post)} disabled={!canModerate}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedPosts.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No posts matched the current filters.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Page {postPage} of {totalPostPages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPostPage((current) => Math.max(1, current - 1))} disabled={postPage === 1}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setPostPage((current) => Math.min(totalPostPages, current + 1))} disabled={postPage === totalPostPages}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All chat messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                {paginatedMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.user_name || message.user_id.slice(0, 8)}</TableCell>
                    <TableCell className="max-w-[420px] truncate">{message.content}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => banUser(message.user_id, message.user_name)} disabled={!canModerate}>
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteMessage(message)} disabled={!canModerate}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedMessages.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No chat messages matched the current filters.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Page {messagePage} of {totalMessagePages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setMessagePage((current) => Math.max(1, current - 1))} disabled={messagePage === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setMessagePage((current) => Math.min(totalMessagePages, current + 1))} disabled={messagePage === totalMessagePages}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCommunityTab;
