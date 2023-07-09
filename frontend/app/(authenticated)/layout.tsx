import { Authenticated } from "@/components/auth/Authenticated";
import { Sidebar } from "@/components/sidebar";
import { SiteHeader } from "@/components/site-header";

export default function Layout(props: React.PropsWithChildren) {
  return (
    <Authenticated>
      <SiteHeader />
      <div className="container flex">
        <Sidebar />
        {props.children}
      </div>
    </Authenticated>
  );
}
