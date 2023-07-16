"use client"

import { QueryClientProvider } from "@tanstack/react-query"

import { queryClient } from "@/lib/query-client"

export const RQQueryClientProvider = (props: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
