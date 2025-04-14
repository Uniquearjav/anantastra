export default function CalculatorLayout({ children }) {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Calculators</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Financial and mathematical calculation tools to help with your computations
        </p>
      </div>
      {children}
    </div>
  );
}