import React, { useState } from "react";
import { ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticate: (success: boolean) => void;
  section: string;
}

const AdminAuthDialog: React.FC<AdminAuthDialogProps> = ({
  open,
  onOpenChange,
  onAuthenticate,
  section,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuthenticate = () => {
    // In a real app, this would be a secure authentication process
    // For demo purposes, we're using a simple password check
    if (password === "admin123") {
      onAuthenticate(true);
      onOpenChange(false);
      setPassword("");
      setError("");
    } else {
      setError("Invalid password. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            Admin Authentication Required
          </DialogTitle>
          <DialogDescription>
            You need admin privileges to edit {section} information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAuthenticate();
                }
              }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-muted-foreground mt-2">
              For demo purposes, use password: admin123
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAuthenticate}>Authenticate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAuthDialog;
