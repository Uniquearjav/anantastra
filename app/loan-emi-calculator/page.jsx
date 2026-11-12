import LoanEmiCalculator from '@/components/ui/loanEmiCalculator/page';
import { generateToolMetadata, generateToolSchema } from '@/lib/seo';
import { BASE_URL } from '@/data/toolsSeo';

export const metadata = {
  ...generateToolMetadata('loan-emi-calculator'),
  alternates: {
    canonical: `${BASE_URL}/tools/calculator/loan-emi-calculator`,
  },
};

export default function LoanEmiCalculatorRootPage() {
  const schemas = generateToolSchema('loan-emi-calculator');

  return (
    <>
      {schemas?.webAppSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webAppSchema) }}
        />
      )}
      {schemas?.breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
        />
      )}
      <LoanEmiCalculator />
    </>
  );
}
