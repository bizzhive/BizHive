import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ShieldAlert, UserCog, UserMinus } from "lucide-react";

interface AdminUsersTabProps {
  profiles: any[];
  roles: any[];
  bans: any[];
  onRefresh: () => Promise<void>;
  currentUserId?: string;
}

const AdminUsersTab = ({ profiles, roles, bans, onRefresh, currentUserId }: AdminUsersTabProps) => {
  const { toast } = useToast();

  const rows = useMemo(() => {
    return profiles.map((profile) => {
      const userRoles = roles.filter((role) => role.user_id === profile.user_id).map((role) => role.role);
      const activeBan = bans.find((ban) => {
        if (ban.user_id !== profile.user_id) return false;
        return !ban.expires_at || +new Date(ban.expires_at) > Date.now();
      });
      return { ...profile, userRoles, activeBan };
    });
  }, [profiles, roles, bans]);

  const addModerator = async (userId: string, existingRoles: string[]) => {
    if (existingRoles.includes("moderator")) return;
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "moderator" });
    if (error) {
      toast({ title: "Role update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Moderator role added" });
    await onRefresh();
  };

  const removeModerator = async (userId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "moderator");
    if (error) {
      toast({ title: "Role update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Moderator removed" });
    await onRefresh();
  };

  const banUser = async (userId: string) => {
    await supabase.from("user_bans").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_bans").insert({
      user_id: userId,
      banned_by: currentUserId ?? null,
      reason: "Admin moderation action",
    });
    if (error) {
      toast({ title: "Ban failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "User banned" });
    await onRefresh();
  };

  const unbanUser = async (userId: string) => {
    const { error } = await supabase.from("user_bans").delete().eq("user_id", userId);
    if (error) {
      toast({ title: "Unban failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "User unbanned" });
    await onRefresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users, roles, and bans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[760px] overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.user_id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{row.full_name || "Unnamed User"}</div>
                      <div className="text-xs text-muted-foreground">{row.user_id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {row.userRoles.length > 0 ? row.userRoles.map((role: string) => (
                        <Badge key={role} variant={role === "admin" ? "default" : "secondary"}>{role}</Badge>
                      )) : <Badge variant="outline">user</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.activeBan ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge variant="outline">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {!row.userRoles.includes("admin") && !row.userRoles.includes("moderator") && (
                        <Button size="sm" variant="outline" onClick={() => addModerator(row.user_id, row.userRoles)}>
                          <UserCog className="h-4 w-4" />
                        </Button>
                      )}
                      {row.userRoles.includes("moderator") && (
                        <Button size="sm" variant="outline" onClick={() => removeModerator(row.user_id)}>
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      )}
                      {!row.activeBan ? (
                        <Button size="sm" variant="destructive" onClick={() => banUser(row.user_id)}>
                          <ShieldAlert className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => unbanUser(row.user_id)}>
                          Unban
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No users found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUsersTab;
