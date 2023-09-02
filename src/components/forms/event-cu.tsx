"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { makeEventsRequest } from "@/api/events.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isPast, isToday } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import { TStructuredErrorResponse } from "@/types/api/common";
import { queryKeys } from "@/lib/constants/query-keys";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

import { CircularSpinner } from "../ui/loading-spinner";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(250, {
      message: "Title must be at most 250 characters long",
    }),
  description: z.any().optional(),
  type: z.string().optional(),
  start_date: z.date(),
  resource_url: z
    .string()
    .regex(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, {
      message: "Invalid URL",
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  eventId?: string;
  onSuccess?: (values: FormValues) => void;
  onError?: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ eventId, ...rest }) => {
  const [eventTypePopoverOpen, setEventTypePopoverOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: eventData, isLoading } = useQuery({
    queryKey: [queryKeys.EVENT_DETAILS, eventId],
    queryFn: () => makeEventsRequest.getEventDetails(eventId || ""),
    enabled: !!eventId,
  });
  const eventTypesQuery = useQuery({
    queryKey: [queryKeys.EVENT_TYPES],
    queryFn: makeEventsRequest.fetchEventTypes,
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: eventData?.title || "",
      description: eventData?.description || "",
      type: eventData?.type.id || undefined,
      start_date: new Date(eventData?.start_date || Date.now()),
      resource_url: eventData?.resource_url ?? undefined,
    },
  });
  const eventUpdateMutation = useMutation({
    mutationFn: (payload: FormValues) =>
      makeEventsRequest.updateEvent<FormValues>(eventId || "", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.EVENT_DETAILS, eventId],
      });
      rest.onSuccess?.(form.getValues());
    },
    onError: (e: TStructuredErrorResponse<{ message: string }>) => {
      toast({
        variant: "destructive",
        description: e.message.error?.message,
      });
      rest.onError?.();
    },
  });
  const eventCreateMutation = useMutation({
    mutationFn: makeEventsRequest.createEvent<FormValues>,
    onSuccess: () => {
      rest.onSuccess?.(form.getValues());
    },
    onError: () => {
      rest.onError?.();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      if (!!eventId) {
        await eventUpdateMutation.mutateAsync(values, {
          onSuccess: () => {
            router.push(`/events/${eventId}`);
          },
        });
      } else {
        await eventCreateMutation.mutateAsync(values, {
          onSuccess: () => {
            router.push("/");
          },
        });
        form.reset();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!!eventId && isLoading) {
    return (
      <div className="text-center">
        <CircularSpinner />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event Type</FormLabel>
              <FormControl>
                <Popover
                  open={eventTypePopoverOpen}
                  onOpenChange={setEventTypePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={eventTypePopoverOpen}
                      className="justify-between w-full"
                    >
                      {field.value
                        ? eventTypesQuery.data?.find(
                            (e) => e.id === field.value
                          )?.heading
                        : "Select event type..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command
                      filter={(value, search) =>
                        eventTypesQuery.data
                          ?.find((t) => t.id === value)
                          ?.heading.toLowerCase()
                          .includes(search)
                          ? 1
                          : 0
                      }
                    >
                      <CommandInput
                        placeholder="Search event types"
                        disabled={!eventTypesQuery.data?.length}
                      />
                      <CommandEmpty>Nothing found 🥲 ...</CommandEmpty>
                      <CommandGroup>
                        {eventTypesQuery.data?.map((type) => (
                          <CommandItem
                            key={type.id}
                            onSelect={(currentValue) => {
                              setEventTypePopoverOpen(false);
                              form.setValue("type", currentValue);
                            }}
                            value={type.id}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === type.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {type.heading}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(d) => d && field.onChange(d)}
                    disabled={(date) => isPast(date) && !isToday(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resource_url"
          render={({ field, formState }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://...." />
              </FormControl>
              <FormMessage>
                {formState.errors.resource_url?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            className="w-fit"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {eventId ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
