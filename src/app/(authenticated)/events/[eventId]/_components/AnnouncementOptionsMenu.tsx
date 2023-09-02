import React, { useState } from "react";
import { makeEventsRequest } from "@/api/events.request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";

import { queryKeys } from "@/lib/constants/query-keys";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventAnnouncementForm } from "@/components/forms/event-announcement-cu";

interface AnnouncementOptionsMenuProps {
  announcementId: string;
  eventId: string;
  isOwner: boolean;
}

export const AnnouncementOptionsMenu: React.FC<
  AnnouncementOptionsMenuProps
> = ({ announcementId, isOwner, eventId }) => {
  const queryClient = useQueryClient();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editEventOpen, setEditEventOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => makeEventsRequest.deleteAnnouncement(announcementId),
    onSuccess: () => {
      setConfirmDeleteOpen(false);
      queryClient.invalidateQueries({
        queryKey: [queryKeys.LIST_EVENT_ANNOUNCEMENTS, eventId],
      });
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
          <DropdownMenuItem onClick={() => setEditEventOpen(true)}>
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
              This will permanently delete this announcement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isLoading}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isLoading}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={editEventOpen} onOpenChange={() => setEditEventOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
            <DialogDescription>
              <EventAnnouncementForm
                onSuccess={() => setEditEventOpen(false)}
                announcementId={announcementId}
                eventId={eventId}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
