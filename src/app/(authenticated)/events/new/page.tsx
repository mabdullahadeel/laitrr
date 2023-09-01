import { EventForm } from "@/components/forms/event-cu";

export default function Page() {
  return (
    <div className="container mt-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-3">New Event</h1>
      <EventForm />
    </div>
  );
}
