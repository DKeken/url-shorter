import { Link2 } from "lucide-react";

export function Header() {
  return (
    <header className="flex flex-col items-center justify-center mb-16 space-y-4">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/50 to-primary/30 blur-xl opacity-50"></div>
        <div className="relative flex items-center justify-center size-20 rounded-full bg-card shadow-lg border border-primary/20">
          <Link2 className="h-10 w-10 text-primary" />
        </div>
      </div>
      <h1 className="text-5xl sm:text-6xl font-bold mt-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
        URLify
      </h1>
      <p className="text-muted-foreground text-center max-w-md text-lg">
        Transform your lengthy URLs into elegant, concise links
      </p>
    </header>
  );
}
