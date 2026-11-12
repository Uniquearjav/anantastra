import PrimeChecker from '@/components/ui/primeChecker/page';
import { generateToolMetadata, generateToolSchema } from '@/lib/seo';
import { BASE_URL } from '@/data/toolsSeo';

export const metadata = {
  ...generateToolMetadata('prime-checker'),
  alternates: {
    canonical: `${BASE_URL}/tools/checkers/prime-checker`,
  },
};

export default function PrimeCheckerRootPage() {
  const schemas = generateToolSchema('prime-checker');

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
      <PrimeChecker />
    </>
  );
}
