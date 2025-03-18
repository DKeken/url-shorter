import { Globe, BarChart3, QrCode } from "lucide-react";

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: FeatureCard[] = [
  {
    icon: <Globe className="h-4 w-4" />,
    title: "Simplify Links",
    description:
      "Convert long URLs into short, memorable links that are easy to share",
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    title: "Track Performance",
    description: "Monitor click-through rates and analyze traffic patterns",
  },
  {
    icon: <QrCode className="h-4 w-4" />,
    title: "QR Integration",
    description:
      "Generate QR codes from your shortened links for offline sharing",
  },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {features.map((feature, index) => (
        <div
          key={index}
          className="relative p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/10 flex flex-col items-center text-center"
        >
          <div className="absolute -top-3 -left-3 flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary border border-primary/20">
            {feature.icon}
          </div>
          <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
