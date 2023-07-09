"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlignHorizontalDistributeEndIcon,
  HomeIcon,
  PanelRight,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
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
    id: 1,
    title: "Home",
    href: "/",
    icon: HomeIcon,
    disabled: false,
  },
  {
    id: 2,
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
        "h-screen pt-5",
        {
          "border-r min-w-[200px] px-4": !isMobile,
        },
        className ?? ""
      )}
    >
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="flex-col gap-2">
          {sidebarNavigation.map((item) => (
            <NavigationMenuItem>
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex items-center gap-2",
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
