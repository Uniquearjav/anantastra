import { generateToolMetadata, generateToolSchema } from '@/lib/seo';

export const metadata = generateToolMetadata('unix-timestamp-converter');

export default function UnixTimestampConverterLayout({ children }) {
  const schemas = generateToolSchema('unix-timestamp-converter');

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
      {children}
    </>
  );
}
