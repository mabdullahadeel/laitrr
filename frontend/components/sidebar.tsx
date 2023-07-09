"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlignHorizontalDistributeEndIcon,
  BadgePlus,
  HomeIcon,
  PanelRight,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const sidebarNavigation = [
  {
    id: "home",
    title: "Home",
    href: "/",
    icon: HomeIcon,
    disabled: false,
  },
  {
    id: "about",
    title: "About",
    href: "/about",
    icon: AlignHorizontalDistributeEndIcon,
    disabled: false,
  },
];

interface SidebarBaseProps {
  className?: string;
  isMobile?: boolean;
}

const SidebarBase: React.FC<SidebarBaseProps> = ({
  className,
  isMobile = false,
}) => {
  const pathName = usePathname();

  return (
    <aside
      className={cn(
        "pt-5",
        {
          "border-r min-w-[200px] px-4": !isMobile,
        },
        className ?? ""
      )}
    >
      <NavigationMenu
        className={cn("mx-auto sticky", {
          "top-24": !isMobile,
        })}
      >
        <NavigationMenuList className="flex-col gap-2 w-full">
          {sidebarNavigation.map((item) => (
            <NavigationMenuItem className="w-full">
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex items-center justify-start gap-2 w-full",
                    {
                      "dark:bg-accent/50": pathName === item.href,
                      "bg-accent": pathName === item.href,
                    }
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="inline-block">{item.title}</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
          <Link href="/events/new" legacyBehavior passHref>
            <Button className="gap-2">
              <BadgePlus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
};

export const Sidebar: React.FC = () => {
  return <SidebarBase className="hidden lg:block" />;
};

export const SidebarMobile: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="lg:hidden">
          <PanelRight />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SidebarBase isMobile />
      </SheetContent>
    </Sheet>
  );
};
