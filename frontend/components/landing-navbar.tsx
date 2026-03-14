"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo } from "@/components/logo";
import { Menu } from "lucide-react";

type LandingNavbarProps = {
  onGetStarted: () => void;
};

export function LandingNavbar({ onGetStarted }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSmoothScroll = (event: React.MouseEvent<HTMLElement>, targetId: string) => {
    event.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b bg-card/95 backdrop-blur-sm border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-xl font-bold">XpertDiagram</span>
        </div>

       

        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" className="hidden sm:flex" onClick={onGetStarted}>
                Start
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign in to start creating diagrams</p>
            </TooltipContent>
          </Tooltip>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <Logo size="sm" />
                  XpertDiagram
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <a
                  href="#features"
                  className="block text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-2 px-4 rounded-md hover:bg-accent"
                  onClick={(event) => handleSmoothScroll(event, "features")}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-2 px-4 rounded-md hover:bg-accent"
                  onClick={(event) => handleSmoothScroll(event, "how-it-works")}
                >
                  How it works
                </a>
                <a
                  href="#about"
                  className="block text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-md hover:bg-accent"
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="block text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-md hover:bg-accent"
                >
                  Contact
                </a>
                <Button
                  variant="default"
                  className="w-full mt-6"
                  onClick={() => {
                    onGetStarted();
                    setMobileMenuOpen(false);
                  }}
                >
                  Start Creating Diagrams
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}


