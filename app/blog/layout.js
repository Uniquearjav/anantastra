export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {children}
      </div>
    </div>
  );
}