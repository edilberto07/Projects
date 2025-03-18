import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ChangeReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
  fieldName: string;
}

const ChangeReasonDialog: React.FC<ChangeReasonDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  fieldName,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for this change");
      return;
    }

    onSubmit(reason);
    onOpenChange(false);
    setReason("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Change Reason Required
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for changing the {fieldName} information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="change-reason">Reason for Change</Label>
            <Textarea
              id="change-reason"
              placeholder="Enter the reason for this change..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeReasonDialog;
