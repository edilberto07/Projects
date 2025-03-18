import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ChangeReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  fieldName: string;
}

const ChangeReasonDialog: React.FC<ChangeReasonDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  fieldName,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError(true);
      return;
    }
    onConfirm(reason);
    onOpenChange(false);
    setReason("");
    setError(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setReason("");
    setError(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Change Reason Required
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleConfirm}>
          <div className="p-4 bg-amber-50 rounded-md mb-4">
            <p className="text-sm text-amber-800">
              You are about to change the {fieldName}. Please provide a reason
              for this change. This will be recorded in the employee's history.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="change-reason"
                className="flex items-center gap-2"
              >
                Reason for Change
              </Label>
              <Textarea
                id="change-reason"
                placeholder="Enter the reason for this change..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (e.target.value.trim()) setError(false);
                }}
                className={error ? "border-red-500" : ""}
              />
              {error && (
                <p className="text-sm text-red-500">
                  Please provide a reason for this change.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Confirm Change</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeReasonDialog;
