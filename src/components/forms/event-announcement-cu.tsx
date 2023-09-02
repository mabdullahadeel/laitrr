import React from "react";
import { makeEventsRequest } from "@/api/events.request";
import {
  EventAnnouncementFormValues,
  eventAnnouncementSchema,
} from "@/schemas/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { queryKeys } from "@/lib/constants/query-keys";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "../ui/button";
import { CircularSpinner } from "../ui/loading-spinner";
import { Textarea } from "../ui/textarea";

interface EventAnnouncementFormProps {
  announcementId?: string;
  eventId: string;
  onSuccess?: (values: EventAnnouncementFormValues) => void;
}

export const EventAnnouncementForm: React.FC<EventAnnouncementFormProps> = ({
  announcementId,
  eventId,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!announcementId;
  const form = useForm<EventAnnouncementFormValues>({
    resolver: zodResolver(eventAnnouncementSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const announcementQuery = useQuery({
    queryKey: [queryKeys.ANNOUNCEMENT_DETAILS, announcementId],
    queryFn: async () => {
      const res = await makeEventsRequest.getAnnouncementDetails(
        announcementId || ""
      );
      form.reset(res);
      return res;
    },
    enabled: isEditing,
  });
  const createAnnouncementMutation = useMutation({
    mutationFn: () =>
      makeEventsRequest.createAnnouncement(eventId, form.getValues()),
    onSuccess: (data) => {
      onSuccess?.(data);
      invalidateRelatedQueries();
    },
  });
  const updateAnnouncementMutation = useMutation({
    mutationFn: () =>
      makeEventsRequest.updateAnnouncement(
        announcementId || "",
        form.getValues()
      ),
    onSuccess: (data) => {
      onSuccess?.(data);
      invalidateRelatedQueries();
    },
  });

  const invalidateRelatedQueries = () => {
    queryClient.invalidateQueries([
      queryKeys.ANNOUNCEMENT_DETAILS,
      announcementId,
    ]);
    queryClient.invalidateQueries([
      queryKeys.LIST_EVENT_ANNOUNCEMENTS,
      eventId,
    ]);
  };

  if (isEditing && announcementQuery.isLoading) {
    return (
      <div className="text-center">
        <CircularSpinner />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async () => {
          try {
            if (isEditing) {
              await updateAnnouncementMutation.mutateAsync();
            } else {
              await createAnnouncementMutation.mutateAsync();
            }
          } catch (error) {
            console.error(error);
          }
        })}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field, formState }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter title" />
              </FormControl>
              <FormMessage>{formState.errors.title?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Write brief description"
                  rows={10}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            className="w-fit"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
