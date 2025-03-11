"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Menu, Star } from "lucide-react";

export default function LandingPreview() {
  return (
    <div className="space-y-12 ">
      <header className="flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
            T
          </div>
          <span className="font-bold text-lg">ThemeUI</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary">
              Features
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Pricing
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Docs
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Blog
            </a>
          </nav>
          <Button>Get Started</Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      <section className="text-center space-y-6 py-12">
        <Badge variant="secondary" className="mb-4">
          New Release
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Build beautiful interfaces <br className="hidden md:inline" />
          with your custom theme
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
          Create stunning web applications with a fully customizable design
          system that adapts to your brand.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            View Documentation
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customizable</CardTitle>
            <CardDescription>Tailor the design to your brand</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Easily customize colors, typography, and spacing to match your
              brand identity and design requirements.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Responsive</CardTitle>
            <CardDescription>Works on any device</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              All components are designed to work flawlessly across desktop,
              tablet, and mobile devices.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accessible</CardTitle>
            <CardDescription>WCAG 2.1 compliant</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Built with accessibility in mind, ensuring your application is
              usable by everyone, regardless of abilities.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Trusted by developers worldwide
          </h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            Join thousands of developers who are building better interfaces with
            our theme system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <div className="flex items-center gap-1 text-amber-500 mb-4">
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
            </div>
            <p className="mb-4">
              "This theme generator has completely transformed our design
              workflow. We can now create consistent UIs across all our
              projects."
            </p>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Jane Cooper</p>
                <p className="text-sm text-muted-foreground">
                  Lead Developer, Acme Inc
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="flex items-center gap-1 text-amber-500 mb-4">
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
            </div>
            <p className="mb-4">
              "The ability to customize every aspect of the UI while maintaining
              consistency has been a game-changer for our team."
            </p>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>RW</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Robert Wilson</p>
                <p className="text-sm text-muted-foreground">
                  UI Designer, TechCorp
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="flex items-center gap-1 text-amber-500 mb-4">
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
              <Star className="fill-current h-5 w-5" />
            </div>
            <p className="mb-4">
              "We've reduced our design implementation time by 50% since
              adopting this theme generator. Highly recommended!"
            </p>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Alex Lee</p>
                <p className="text-sm text-muted-foreground">CTO, StartupX</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="bg-muted p-8 rounded-lg">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to transform your UI?</h2>
            <p className="text-muted-foreground">
              Start building beautiful interfaces with your custom theme today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg">Get Started for Free</Button>
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Changelog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cookies
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Licenses
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
              T
            </div>
            <span className="font-bold">ThemeUI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 ThemeUI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
