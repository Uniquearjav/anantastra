import MorseCodeConverter from '@/components/ui/morseCodeConverter/page';
import { generateToolMetadata, generateToolSchema } from '@/lib/seo';
import { BASE_URL } from '@/data/toolsSeo';

export const metadata = {
  ...generateToolMetadata('morse-code-converter'),
  alternates: {
    canonical: `${BASE_URL}/tools/converters/morse-code-converter`,
  },
};

export default function MorseCodeConverterRootPage() {
  const schemas = generateToolSchema('morse-code-converter');

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
      <MorseCodeConverter />
    </>
  );
}
