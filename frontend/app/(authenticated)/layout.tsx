import { Authenticated } from "@/components/auth/Authenticated";
import { Sidebar } from "@/components/sidebar";
import { SiteHeader } from "@/components/site-header";

export default function Layout(props: React.PropsWithChildren) {
  return (
    <Authenticated>
      <SiteHeader />
      <main className="md:container w-full px-3 md:px-0 flex min-h-[93vh]">
        <Sidebar />
        <main className="w-full md:container">{props.children}</main>
      </main>
    </Authenticated>
  );
}
