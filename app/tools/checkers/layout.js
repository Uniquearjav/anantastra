export default function CheckersLayout({ children }) {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Checkers</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Validation tools to check and analyze various inputs
        </p>
      </div>
      {children}
    </div>
  );
}