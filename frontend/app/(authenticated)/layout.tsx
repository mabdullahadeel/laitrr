import { Authenticated } from "@/components/auth/Authenticated";
import { SiteHeader } from "@/components/site-header";

export default function Layout(props: React.PropsWithChildren) {
  return (
    <Authenticated>
      <SiteHeader />
      {props.children}
    </Authenticated>
  );
}
