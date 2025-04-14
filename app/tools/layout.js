export default function ToolsLayout({ children }) {
  return (
    <div>
      <div className="py-8 bg-blue-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Anantastra Tools</h1>
          <p className="text-center mt-2 text-gray-600 dark:text-gray-400">
            Free, privacy-focused utilities for your everyday needs
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}