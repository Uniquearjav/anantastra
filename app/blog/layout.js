export default function BlogLayout({ children }) {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Anantastra Blog</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Insights, updates, and information about our tools and privacy practices
        </p>
      </div>
      {children}
    </div>
  );
}