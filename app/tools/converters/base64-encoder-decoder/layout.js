import { generateToolMetadata, generateToolSchema } from '@/lib/seo';

export const metadata = generateToolMetadata('base64-encoder-decoder');

export default function Base64ConverterLayout({ children }) {
  const schemas = generateToolSchema('base64-encoder-decoder');

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
