"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shortenUrl, getUrlInfo } from "@/lib/api";
import { toast } from "sonner";
import { Globe, Link2, ChevronRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { CreateUrlInput } from "@/types";

interface ShortenerFormProps {
  onSuccess: (shortUrl: string) => void;
}

export function ShortenerForm({ onSuccess }: ShortenerFormProps) {
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleShortenUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    try {
      const data: CreateUrlInput = {
        originalUrl: url,
        alias: shortCode || undefined,
      };

      const fullShortUrl = await shortenUrl(data);

      onSuccess(fullShortUrl);
      toast.success("URL shortened successfully!");
    } catch (error) {
      toast.error("Failed to shorten URL");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-primary/10 shadow-xl bg-card/80 backdrop-blur-md">
      <CardHeader className="space-y-1 pb-4 border-b border-primary/5">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Create Your Short URL
        </CardTitle>
        <CardDescription>
          Enter a long URL to create a shorter, more manageable link
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleShortenUrl} className="space-y-8">
          <div className="space-y-4">
            <Label htmlFor="url" className="text-foreground">
              URL to Shorten
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/long-url-that-needs-shortening"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="pl-10 h-11 transition-all focus-visible:ring-primary border-primary/10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="shortCode" className="text-foreground">
                Custom Short Code (Optional)
              </Label>
              <span className="text-xs text-muted-foreground">
                Make it memorable
              </span>
            </div>
            <div className="relative">
              <Link2 className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="shortCode"
                placeholder="my-custom-code"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
                className="pl-10 h-11 transition-all focus-visible:ring-primary border-primary/10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 transition-all hover:shadow-md group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Shorten URL
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
