import { useEffect, useState, type ReactNode } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { verifyTemporaryAdminPassword } from "@/services/admin/access";

type AdminAccessDialogProps = {
  description?: string;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  open?: boolean;
  title?: string;
  trigger?: ReactNode;
};

export const AdminAccessDialog = ({
  description = "Enter the temporary admin password to open the control panel.",
  onOpenChange,
  onSuccess,
  open,
  title = "Temporary Admin Access",
  trigger,
}: AdminAccessDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const controlled = open !== undefined;
  const dialogOpen = controlled ? open : internalOpen;
  const { toast } = useToast();

  const setDialogOpen = (nextOpen: boolean) => {
    if (!controlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (!dialogOpen) {
      setPassword("");
      setSubmitting(false);
    }
  }, [dialogOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!password.trim() || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await verifyTemporaryAdminPassword(password.trim());
      toast({ title: "Access granted", description: "Admin controls are now unlocked for this session." });
      setDialogOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Incorrect password",
        description: error instanceof Error ? error.message : "Unable to verify the admin password.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="overflow-hidden rounded-[28px] border-border/70 bg-background/98 p-0 shadow-[0_30px_80px_rgba(16,12,8,0.28)] sm:max-w-md">
        <div className="border-b border-border/70 bg-[radial-gradient(circle_at_top,_rgba(255,145,77,0.18),_transparent_52%),linear-gradient(180deg,_rgba(255,255,255,0.04),_transparent)] px-6 py-5">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-[inset_0_0_0_1px_rgba(255,145,77,0.18)]">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="font-display text-2xl tracking-tight">{title}</DialogTitle>
            <DialogDescription className="text-sm leading-6 text-muted-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="admin-password">
              Admin password
            </label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={cn(
                "h-12 rounded-2xl border-border/70 bg-muted/40 px-4",
                "focus-visible:ring-2 focus-visible:ring-primary/30"
              )}
            />
          </div>

          <DialogFooter className="gap-3 sm:justify-between sm:space-x-0">
            <p className="text-xs leading-5 text-muted-foreground">
              This temporary gate is isolated so it can be replaced later with role-based auth.
            </p>
            <Button type="submit" disabled={submitting || !password.trim()} className="h-11 rounded-2xl px-5">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitting ? "Checking..." : "Open admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
