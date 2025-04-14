export default function ConvertersLayout({ children }) {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Converters</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tools for converting between various formats and units
        </p>
      </div>
      {children}
    </div>
  );
}