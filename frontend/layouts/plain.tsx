import { SiteHeader } from "@/components/site-header";

export const PlainLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full flex-1">{children}</main>
    </div>
  );
};
