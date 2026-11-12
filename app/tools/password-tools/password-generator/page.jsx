import PasswordGenerator from '@/components/ui/passwordGenerator/page';
import { generateToolMetadata, generateToolSchema } from '@/lib/seo';

export const metadata = generateToolMetadata('password-generator');

export default function ToolsPasswordGeneratorPage() {
  const schemas = generateToolSchema('password-generator');

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
      <PasswordGenerator />
    </>
  );
}
