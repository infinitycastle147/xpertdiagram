"use client";

import React, { useState } from "react";
import { LandingNavbar } from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { Star, ArrowRight } from "lucide-react";
import { SignIn } from "@clerk/nextjs";

export function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false);

  const handleGetStarted = () => {
    setShowSignIn(true);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <LandingNavbar onGetStarted={handleGetStarted} />

        {/* Hero Section */}
        <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-8 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                  Transform complex data into clear diagrams
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0">
                  AI-powered diagram generation that turns raw text into visual insights.
                  Create professional diagrams with minimal effort and maximum precision.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button size="lg" className="px-6 sm:px-8 w-full sm:w-auto" onClick={handleGetStarted}>
                    Get started
                  </Button>
                  <Button size="lg" variant="outline" className="px-6 sm:px-8 w-full sm:w-auto justify-center">
                    Learn more
                  </Button>
                </div>
              </div>

              <div className="relative max-w-xl w-full mx-auto mt-10 lg:mt-0">
                <div className="bg-muted/50 rounded-2xl p-6 sm:p-8 lg:p-10 w-full min-h-[220px] sm:min-h-[280px] flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted-foreground/40 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section id="features" className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Features</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
              Powerful diagram generation tools
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Simplify complex information with intelligent diagram creation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Raw Text Input */}
            <Card className="p-5 sm:p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-primary/20 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Raw text input</h3>
              <p className="text-muted-foreground mb-6">
                Convert textual data into visual diagrams seamlessly.
              </p>
              <Button variant="ghost" className="p-0 h-auto font-medium">
                Explore <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>

            {/* AI Type Detection */}
            <Card className="p-5 sm:p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-accent/20 rounded"></div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  New
                </Badge>
                <h3 className="text-xl font-semibold">AI type detection</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Intelligent algorithm suggests optimal diagram types automatically.
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Discover <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Learn more about AI-powered diagram detection</p>
                </TooltipContent>
              </Tooltip>
              <div className="mt-6 bg-muted/50 rounded-lg p-4 w-full min-h-[180px] flex items-center justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted-foreground/20 rounded-lg"></div>
              </div>
            </Card>

            {/* AI Chatbot Support */}
            <Card className="p-5 sm:p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-secondary/20 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI chatbot support</h3>
              <p className="text-muted-foreground mb-6">
                Get real-time assistance and guidance for diagram creation.
              </p>
              <Button variant="ghost" className="p-0 h-auto font-medium">
                Chat <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>

            {/* Customization Options */}
            <Card className="p-5 sm:p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-primary/20 rounded"></div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
                  Smart
                </Badge>
                <h3 className="text-xl font-semibold">Customization options</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Personalize diagram themes, fonts, and visual settings.
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Customize <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Explore customization features</p>
                </TooltipContent>
              </Tooltip>
              <div className="mt-6 bg-muted/50 rounded-lg p-4 w-full min-h-[160px] flex items-center justify-center">
                <div className="w-12 h-12 bg-muted-foreground/20 rounded-lg"></div>
              </div>
            </Card>

            {/* Export Capabilities */}
            <Card className="p-5 sm:p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-secondary/20 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Export capabilities</h3>
              <p className="text-muted-foreground mb-6">
                Share and download diagrams in multiple formats.
              </p>
              <Button variant="ghost" className="p-0 h-auto font-medium">
                Export <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>

            {/* Collaborative Tools */}
            <Card className="p-5 sm:p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-accent/20 rounded"></div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground">
                  Advanced
                </Badge>
                <h3 className="text-xl font-semibold">Collaborative tools</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Work together and share diagram insights effortlessly.
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Collaborate <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Discover collaboration features</p>
                </TooltipContent>
              </Tooltip>
              <div className="mt-6 bg-muted/50 rounded-lg p-4 w-full min-h-[180px] flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted-foreground/20 rounded-full"></div>
                  <div className="text-xs text-muted-foreground">Project</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Process</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
              Create diagrams in four simple steps
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamline your diagram creation with our intuitive workflow designed for efficiency and clarity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="bg-muted rounded-lg mb-6 flex items-center justify-center w-full min-h-[180px] sm:min-h-[200px]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-muted-foreground/40 rounded"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Enter raw text data
              </h3>
              <p className="text-muted-foreground">
                Input your textual information directly into our intelligent
                platform for instant visualization.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-muted rounded-lg mb-6 flex items-center justify-center w-full min-h-[180px] sm:min-h-[200px]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-muted-foreground/40 rounded"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Select diagram type
              </h3>
              <p className="text-muted-foreground">
                Choose from multiple diagram formats or let our AI recommend the
                best visual representation.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-muted rounded-lg mb-6 flex items-center justify-center w-full min-h-[180px] sm:min-h-[200px]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-muted-foreground/40 rounded"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Customize and refine
              </h3>
              <p className="text-muted-foreground">
                Adjust themes, fonts, and visual settings to match your specific
                presentation needs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-muted rounded-lg mb-6 flex items-center justify-center w-full min-h-[180px] sm:min-h-[200px]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-muted-foreground/40 rounded"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Generate and export
              </h3>
              <p className="text-muted-foreground">
                Instantly create your diagram and export in multiple formats for
                seamless sharing.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="px-6 sm:px-8 w-full sm:w-auto">
                Start now
              </Button>
              <Button size="lg" variant="ghost" className="px-6 sm:px-8 w-full sm:w-auto">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Feature Highlights */}
      <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Time Efficiency */}
            <div className="space-y-8 text-center lg:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  01 Time efficiency
                </p>
                <p className="text-xs text-muted-foreground mb-2">Speed</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
                  Transform complex data with lightning fast diagrams
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
                  Generate professional diagrams in minutes, not hours.
                  Eliminate manual drawing and reduce workflow bottlenecks.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="w-full sm:w-auto px-6 sm:px-8">
                    Learn more
                  </Button>
                  <Button variant="ghost" className="w-full sm:w-auto justify-center px-6 sm:px-8">
                    Explore <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative max-w-xl w-full mx-auto mt-10 lg:mt-0">
              <div className="bg-muted/50 rounded-2xl p-6 sm:p-8 lg:p-10 w-full min-h-[220px] sm:min-h-[280px] flex items-center justify-center">
                <div className="absolute top-4 right-4 text-6xl font-bold text-muted-foreground/20 pointer-events-none select-none">
                  1
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted-foreground/40 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Precision Mapping */}
      <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1 max-w-xl w-full mx-auto lg:mx-0 mt-10 lg:mt-0">
              <div className="bg-muted/50 rounded-2xl p-6 sm:p-8 lg:p-10 w-full min-h-[220px] sm:min-h-[280px] flex items-center justify-center">
                <div className="absolute top-4 right-4 text-6xl font-bold text-muted-foreground/20 pointer-events-none select-none">
                  2
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted-foreground/40 rounded"></div>
                </div>
              </div>
            </div>
            <div className="space-y-8 order-1 lg:order-2 text-center lg:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  02 Precision mapping
                </p>
                <p className="text-xs text-muted-foreground mb-2">Accuracy</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
                  Intelligent diagram generation for technical teams
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
                  AI-powered algorithms ensure your diagrams reflect exact data
                  relationships with minimal human error.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="w-full sm:w-auto px-6 sm:px-8">
                    Discover
                  </Button>
                  <Button variant="ghost" className="w-full sm:w-auto justify-center px-6 sm:px-8">
                    Analyze <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seamless Integration */}
      <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  03 Seamless integration
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  Flexibility
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
                  Adaptable diagram tools for every workflow
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
                  Compatible with multiple platforms and data formats. Customize
                  your visualization experience effortlessly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="w-full sm:w-auto px-6 sm:px-8">
                    Try now
                  </Button>
                  <Button variant="ghost" className="w-full sm:w-auto justify-center px-6 sm:px-8">
                    Connect <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative max-w-xl w-full mx-auto mt-10 lg:mt-0">
              <div className="bg-muted/50 rounded-2xl p-6 sm:p-8 lg:p-10 w-full min-h-[220px] sm:min-h-[280px] flex items-center justify-center">
                <div className="absolute top-4 right-4 text-6xl font-bold text-muted-foreground/20 pointer-events-none select-none">
                  3
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted-foreground/40 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaborative Insights */}
      <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1 max-w-xl w-full mx-auto lg:mx-0 mt-10 lg:mt-0">
              <div className="bg-muted/50 rounded-2xl p-6 sm:p-8 lg:p-10 w-full min-h-[220px] sm:min-h-[280px] flex items-center justify-center">
                <div className="absolute top-4 right-4 text-6xl font-bold text-muted-foreground/20 pointer-events-none select-none">
                  4
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted-foreground/40 rounded"></div>
                </div>
              </div>
            </div>
            <div className="space-y-8 order-1 lg:order-2 text-center lg:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  04 Collaborative insights
                </p>
                <p className="text-xs text-muted-foreground mb-2">Teamwork</p>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
                  Share and communicate complex information clearly
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
                  Enable team understanding through visual representations that
                  transcend traditional communication barriers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="w-full sm:w-auto px-6 sm:px-8">
                    Get started
                  </Button>
                  <Button variant="ghost" className="w-full sm:w-auto justify-center px-6 sm:px-8">
                    Share <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">What our users say</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Real experiences from professionals across industries
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="p-6 md:p-8">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                XpertDiagram transformed our complex project mapping into clear,
                actionable visuals.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    MC
                  </span>
                </div>
                <div>
                  <p className="font-medium">Michael Chen</p>
                  <p className="text-sm text-muted-foreground">
                    CTO, TechInnovate Solutions
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The AI detection feature is a game-changer for our design
                workflow.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    SR
                  </span>
                </div>
                <div>
                  <p className="font-medium">Sarah Rodriguez</p>
                  <p className="text-sm text-muted-foreground">
                    Design Lead, Creative Dynamics
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Incredibly intuitive tool that saves hours of manual diagram
                creation.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    DT
                  </span>
                </div>
                <div>
                  <p className="font-medium">David Thompson</p>
                  <p className="text-sm text-muted-foreground">
                    Project Manager, Global Enterprises
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-muted/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
            Ready to revolutionize your diagramming
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start creating intelligent, precise diagrams with our AI-powered
            platform today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-6 sm:px-8 w-full sm:w-auto" onClick={handleGetStarted}>
              Start free trial
            </Button>
            <Button size="lg" variant="outline" className="px-6 sm:px-8 w-full sm:w-auto">
              Schedule demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 md:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Logo size="sm" />
                <span className="text-xl font-bold">XpertDiagram</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Subscribe</p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                    <Input
                      placeholder="Get diagram updates"
                      className="flex-1 w-full"
                    />
                    <Button variant="outline" className="w-full sm:w-auto">
                      Submit
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    By subscribing, you agree to our privacy terms and
                    conditions.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Enterprise
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Teams
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-muted-foreground text-center sm:text-left">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookie settings
              </a>
            </div>
            <p className="text-sm text-muted-foreground text-center sm:text-right">
              © 2024 XpertDiagram. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Sign In Dialog */}
      <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Logo size="sm" />
                <span className="text-xl font-bold">XpertDiagram</span>
              </div>
              <p className="text-sm text-muted-foreground font-normal">
                Sign in to start creating expert diagrams
              </p>
            </DialogTitle>
          </DialogHeader>
          <SignIn
            routing="hash"
            appearance={{
              elements: {
                card: "shadow-none border-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              },
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  </TooltipProvider>
);
}
