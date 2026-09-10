import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

export default function CheckersLayout({ children }) {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Link href="/tools" className="hover:text-foreground transition-colors">
              Tools
            </Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="font-medium text-foreground">Checkers & Validation</span>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>All Tools</span>
          </Link>
        </div>
      </div>
      <div className="py-6 sm:py-8">{children}</div>
    </div>
  );
}