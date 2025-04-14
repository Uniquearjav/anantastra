export default function PasswordToolsLayout({ children }) {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Password Tools</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tools for password generation, management, and security
        </p>
      </div>
      {children}
    </div>
  );
}