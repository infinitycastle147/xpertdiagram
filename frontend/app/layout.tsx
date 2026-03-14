import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ClerkProvider, SignedIn, SignedOut, SignIn, UserButton} from "@clerk/nextjs";
import SupabaseProvider from "@/app/supabase-provider";
import { Logo } from "@/components/logo";
import { BackendHealthGateway } from "@/components/backend-health-gateway";
import { LandingPage } from "@/components/landing-page";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "XpertDiagram - Create Expert Diagrams with AI",
    description: "Transform your ideas into beautiful, professional diagrams using AI-powered tools. Simple, fast, and expert.",
};

export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" className="h-full dark">
            <head>
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-background text-foreground`}
            >
            <SupabaseProvider>
                <SignedOut>
                    <LandingPage />
                </SignedOut>

                <SignedIn>
                    <div className="h-full flex flex-col">
                        {/* Single Application Header */}
                        <header
                            className="border-b bg-card/95 backdrop-blur-sm border-border z-50 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 sm:py-4 sticky top-0">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <Logo />
                                <div className="min-w-0">
                                    <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
                                        XpertDiagram
                                    </h1>
                                    <p className="text-xs text-muted-foreground hidden sm:block">Expert diagrams with AI</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <UserButton 
                                    showName 
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "w-8 h-8 sm:w-10 sm:h-10",
                                            userButtonOuterIdentifier: "text-sm font-medium"
                                        }
                                    }}
                                />
                            </div>
                        </header>

                        {/* Main Content Area */}
                        <main className="flex-1 overflow-hidden">
                            <BackendHealthGateway>
                                <div className="h-full w-full">
                                    {children}
                                </div>
                            </BackendHealthGateway>
                        </main>
                    </div>
                </SignedIn>
            </SupabaseProvider>
            </body>
            </html>
        </ClerkProvider>
    );

}
