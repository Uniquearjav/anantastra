import { generateToolMetadata, generateToolSchema } from '@/lib/seo';
import { ToolPageWrapper } from '@/components/ads';

export const metadata = generateToolMetadata('text');

export default function TextLayout({ children }) {
  const schemas = generateToolSchema('text');

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
      <ToolPageWrapper>
        {children}
      </ToolPageWrapper>
    </>
  );
}
