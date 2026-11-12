import PasswordGenerator from '@/components/ui/passwordGenerator/page';
import { generateToolMetadata, generateToolSchema } from '@/lib/seo';
import { BASE_URL } from '@/data/toolsSeo';

export const metadata = {
  ...generateToolMetadata('password-generator'),
  alternates: {
    canonical: `${BASE_URL}/tools/password-tools/password-generator`,
  },
};

export default function PasswordGeneratorRootPage() {
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
      <PasswordGenerator />
    </>
  );
}
