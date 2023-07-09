"use client";

import { useRouter } from "next/navigation";
import { makeEventsRequest } from "@/api/events.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
});

export default function Page() {
  const router = useRouter();
  const eventCreateMutation = useMutation({
    mutationFn: makeEventsRequest.createEvent<z.infer<typeof formSchema>>,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await eventCreateMutation.mutateAsync(values, {
        onSuccess: () => {
          // TODO: add toast
          router.push("/");
        },
      });
      form.reset();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="container mt-4">
      <h1 className="text-2xl font-bold mb-3">New Event</h1>
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
          <div className="flex justify-end">
            <Button
              className="w-fit"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
