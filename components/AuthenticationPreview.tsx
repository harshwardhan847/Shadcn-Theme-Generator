import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Chrome, Github } from "lucide-react";

export default function AuthenticationPreview() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-lg border shadow-lg md:grid-cols-2">
        <div className="flex flex-col justify-center bg-card p-8">
          <Card className="border-none shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome Back!
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      variant="link"
                      className="px-0 text-xs h-auto"
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
              <div className="relative my-4">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  OR CONTINUE WITH
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline">
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </CardContent>
            <CardFooter className="justify-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?
              </span>
              <Button variant="link" className="ml-1 px-0 h-auto" type="button">
                Sign up
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="relative hidden items-center justify-center bg-muted p-8 md:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30"></div>
          <div className="z-10 text-center text-primary-foreground">
            <h1 className="text-4xl font-bold">Theme Generator</h1>
            <p className="mt-2 text-lg opacity-80">
              Visualize your perfect theme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
