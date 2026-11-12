import MorseCodeConverter from '@/components/ui/morseCodeConverter/page';
import { generateToolMetadata, generateToolSchema } from '@/lib/seo';

export const metadata = generateToolMetadata('morse-code-converter');

export default function ToolsMorseCodeConverterPage() {
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
      {schemas?.faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
        />
      )}
      <MorseCodeConverter />
    </>
  );
}
