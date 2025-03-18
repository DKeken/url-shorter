"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, X, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QRCodeComponentProps {
  url: string;
  onClose: () => void;
}

export function QRCodeComponent({ url, onClose }: QRCodeComponentProps) {
  const [qrSize, setQrSize] = useState(200);
  const [qrFgColor, setQrFgColor] = useState("#000000");
  const [qrLevel, setQrLevel] = useState<"L" | "M" | "Q" | "H">("L");
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;

    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) {
      toast.error("Could not find QR code to download");
      return;
    }

    try {
      // Add white background to SVG to ensure it's visible on all backgrounds
      const originalBg = svgElement.getAttribute("style");
      svgElement.setAttribute("style", "background-color: white;");

      const svgData = new XMLSerializer().serializeToString(svgElement);

      // Restore original style
      if (originalBg) {
        svgElement.setAttribute("style", originalBg);
      } else {
        svgElement.removeAttribute("style");
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error("Could not create canvas context");
        return;
      }

      const img = new Image();
      img.onload = () => {
        canvas.width = qrSize;
        canvas.height = qrSize;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        try {
          const pngUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = "qrcode.png";
          link.href = pngUrl;
          link.click();
          toast.success("QR code downloaded!");
        } catch (e) {
          console.error("Error creating PNG:", e);
          toast.error("Failed to generate PNG");
        }
      };

      img.onerror = () => {
        toast.error("Failed to create image from SVG");
        console.error("Image loading error");
      };

      // Convert SVG to data URL with proper encoding
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    } catch (error) {
      console.error("Error in QR download:", error);
      toast.error("Failed to download QR code");
    }
  };

  return (
    <Card className="mt-6 overflow-hidden border-primary/10 shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-2 border-b border-primary/5">
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="h-4 w-4 text-primary" />
          QR Code for Shortened URL
        </CardTitle>
        <CardDescription>Customize and download your QR code</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 flex items-center justify-center">
            <div
              ref={qrRef}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <QRCodeSVG
                value={url}
                size={qrSize}
                bgColor="#FFFFFF"
                fgColor={qrFgColor}
                level={qrLevel}
                includeMargin={false}
              />
            </div>
          </div>

          <div className="flex-grow space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="qr-size" className="text-xs font-medium">
                QR Code Size
              </Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-md border-primary/20"
                  onClick={() => setQrSize(Math.max(100, qrSize - 20))}
                >
                  -
                </Button>
                <Input
                  id="qr-size"
                  type="range"
                  min="100"
                  max="300"
                  step="10"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="h-2"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-md border-primary/20"
                  onClick={() => setQrSize(Math.min(300, qrSize + 20))}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="qr-color" className="text-xs font-medium">
                QR Code Color
              </Label>
              <div className="grid grid-cols-6 gap-2">
                {[
                  "#000000",
                  "#0f172a",
                  "#1e40af",
                  "#0891b2",
                  "#7c3aed",
                  "#be123c",
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => setQrFgColor(color)}
                    className={cn(
                      "w-full aspect-square rounded-md flex items-center justify-center",
                      qrFgColor === color
                        ? "ring-2 ring-primary ring-offset-1"
                        : ""
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Set QR code color to ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="qr-level" className="text-xs font-medium">
                Error Correction Level
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "L", label: "Low (7%)" },
                  { value: "M", label: "Medium (15%)" },
                  { value: "Q", label: "Quartile (25%)" },
                  { value: "H", label: "High (30%)" },
                ].map((level) => (
                  <Button
                    key={level.value}
                    variant={qrLevel === level.value ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 text-xs",
                      qrLevel !== level.value ? "border-primary/20" : ""
                    )}
                    onClick={() =>
                      setQrLevel(level.value as "L" | "M" | "Q" | "H")
                    }
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-primary/5 pt-4">
        <p className="text-xs text-muted-foreground">
          {url.length > 30
            ? `Scan to access your URL: ${url.substring(0, 30)}...`
            : `Scan to access your URL: ${url}`}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1 border-primary/20"
            onClick={downloadQR}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1 border-primary/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
