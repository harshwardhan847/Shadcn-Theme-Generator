import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn utility

// Dummy data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "Mastering Shadcn UI: A Comprehensive Guide",
    excerpt:
      "Learn how to leverage the power of Shadcn UI to build beautiful and accessible interfaces faster than ever before.",
    author: "Alex Johnson",
    authorInitials: "AJ",
    date: "April 10, 2025",
    tags: ["Shadcn UI", "React", "Web Development"],
    // Define gradient stops (can be customized per post or use a pattern)
    gradient: "from-primary/70 to-primary/40",
  },
  {
    id: 2,
    title: "The Future of Frontend: Trends to Watch in 2025",
    excerpt:
      "Explore the latest trends shaping the future of frontend development, from new frameworks to AI-powered tools.",
    author: "Samantha Lee",
    authorInitials: "SL",
    date: "April 5, 2025",
    tags: ["Frontend", "Trends", "JavaScript"],
    gradient: "from-accent-foreground/50 to-accent-foreground/20", // Example using accent
  },
  {
    id: 3,
    title: "Optimizing Performance in React Applications",
    excerpt:
      "Discover key techniques and best practices for boosting the performance and speed of your React applications.",
    author: "Chris Mendez",
    authorInitials: "CM",
    date: "March 28, 2025",
    tags: ["React", "Performance", "Optimization"],
    gradient: "from-secondary/60 to-secondary/30", // Example using secondary
  },
];

export default function BlogPreview() {
  return (
    <div className="w-full bg-background p-6 rounded-md">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">From the Blog</h2>
        <p className="text-muted-foreground mt-2">
          Latest articles and insights from our team.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card
            key={post.id}
            className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg bg-card" // Ensure card background is set
          >
            {/* Gradient Placeholder */}
            <div
              className={cn(
                "h-48 w-full bg-gradient-to-br", // Base gradient classes
                post.gradient // Apply specific gradient from post data
              )}
            >
              {/* Optionally add subtle pattern or texture here */}
            </div>

            <div className="p-6 flex flex-col flex-grow">
              {" "}
              {/* Use padding for content */}
              <div className="mb-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {" "}
                    {/* Use outline variant like image */}
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-lg font-semibold leading-snug mb-2">
                {" "}
                {/* Adjusted size */}
                {post.title}
              </CardTitle>
              <CardDescription className="text-sm flex-grow mb-4">
                {" "}
                {/* Adjusted size */}
                {post.excerpt}
              </CardDescription>
              <div className="flex items-center justify-between pt-4 border-t mt-auto">
                {" "}
                {/* Footer at bottom */}
                <div className="flex items-center gap-3">
                  {" "}
                  {/* Increased gap */}
                  <Avatar className="h-9 w-9">
                    {" "}
                    {/* Slightly larger avatar */}
                    <AvatarImage
                      src={`/avatar-${post.authorInitials.toLowerCase()}.png`}
                    />
                    <AvatarFallback>{post.authorInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {post.author}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {post.date}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium"
                >
                  {" "}
                  {/* Adjusted button style */}
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
