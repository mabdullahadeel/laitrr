import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { makeEventsRequest } from "@/api/events.request";
import { useMutation } from "@tanstack/react-query";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircularSpinner } from "@/components/ui/loading-spinner";

interface EventOptionsMenuProps {
  isOwner: boolean;
  eventId: string;
}

export const EventOptionsMenu: React.FC<EventOptionsMenuProps> = ({
  isOwner,
  eventId,
}) => {
  const router = useRouter();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const deleteEventMutation = useMutation({
    mutationFn: () => makeEventsRequest.deleteEvent(eventId),
    onSuccess: () => {
      router.push("/");
    },
  });

  if (!isOwner) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost">
            <MoreVertical size={24} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Edit2 className="mr-2" size={16} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setConfirmDeleteOpen(true)}>
            <Trash2 className="mr-2" size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={confirmDeleteOpen}
        onOpenChange={() => setConfirmDeleteOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteEventMutation.isLoading}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => deleteEventMutation.mutate()}
              disabled={deleteEventMutation.isLoading}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
