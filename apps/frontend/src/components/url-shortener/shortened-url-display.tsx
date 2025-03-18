"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, Clipboard, QrCode, Share2, ExternalLink } from "lucide-react";
import { QRCodeComponent } from "./qr-code-component";

interface ShortenedUrlDisplayProps {
  shortUrl: string;
}

export function ShortenedUrlDisplay({ shortUrl }: ShortenedUrlDisplayProps) {
  const [showQR, setShowQR] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="mt-10 p-6 rounded-lg border border-primary/20 bg-primary/5 backdrop-blur-sm shadow-sm">
      <p className="text-sm font-medium mb-4 text-card-foreground flex items-center gap-2">
        <ExternalLink className="h-4 w-4 text-primary" />
        Your shortened URL is ready:
      </p>
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-grow">
          <Input
            value={shortUrl}
            readOnly
            className="pr-12 font-medium bg-background/50 h-11 border-primary/20"
          />
          <button
            onClick={() => copyToClipboard(shortUrl)}
            className="absolute right-1 top-1 p-2 rounded-md hover:bg-primary/10 text-muted-foreground"
            aria-label="Copy URL"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 sm:flex gap-2">
          <Button
            onClick={() => copyToClipboard(shortUrl)}
            variant="outline"
            className="items-center gap-2 hover:bg-primary/10 border-primary/20"
            size="sm"
          >
            <Clipboard className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Copy</span>
          </Button>
          <Button
            onClick={() => setShowQR(!showQR)}
            variant="outline"
            className="items-center gap-2 hover:bg-primary/10 border-primary/20"
            size="sm"
          >
            <QrCode className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">QR Code</span>
          </Button>
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: "Shortened URL",
                    text: "Check out this shortened URL",
                    url: shortUrl,
                  })
                  .catch(console.error);
              } else {
                copyToClipboard(shortUrl);
              }
            }}
            variant="outline"
            className="items-center gap-2 hover:bg-primary/10 border-primary/20"
            size="sm"
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Share</span>
          </Button>
        </div>
      </div>

      {showQR && (
        <QRCodeComponent url={shortUrl} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}
