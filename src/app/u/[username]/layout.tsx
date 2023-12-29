import { SiteHeader } from "@/components/site-header";

export default function Layout(props: React.PropsWithChildren) {
  return (
    <>
      <SiteHeader />
      <main className="md:container w-full px-3 md:px-0 flex min-h-[93vh]">
        <div className="w-full md:container">{props.children}</div>
      </main>
    </>
  );
}
