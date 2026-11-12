import InterestCalculator from '@/components/ui/intrestCalculator/page';
import { generateToolMetadata, generateToolSchema } from '@/lib/seo';
import { BASE_URL } from '@/data/toolsSeo';

export const metadata = {
  ...generateToolMetadata('interest-calculator'),
  alternates: {
    canonical: `${BASE_URL}/tools/calculator/interest-calculator`,
  },
};

export default function InterestCalculatorRootPage() {
  const schemas = generateToolSchema('interest-calculator');

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
      <InterestCalculator />
    </>
  );
}
