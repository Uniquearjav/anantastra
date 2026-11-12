import PasswordAgeChecker from '@/components/ui/passwordAgeChecker/page';
import { generateToolMetadata, generateToolSchema } from '@/lib/seo';
import { BASE_URL } from '@/data/toolsSeo';

export const metadata = {
  ...generateToolMetadata('password-age-checker'),
  alternates: {
    canonical: `${BASE_URL}/tools/password-tools/password-age-checker`,
  },
};

export default function PasswordAgeCheckerRootPage() {
  const schemas = generateToolSchema('password-age-checker');

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
      <PasswordAgeChecker />
    </>
  );
}
