import { AuthenticationRoute } from "@/components/auth/AuthenticationRoute";
import { SiteHeader } from "@/components/site-header";

export default function Layout(props: React.PropsWithChildren) {
  return (
    <AuthenticationRoute>
      <SiteHeader />
      {props.children}
    </AuthenticationRoute>
  );
}
