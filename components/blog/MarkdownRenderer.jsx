"use client";

import React from 'react';
import Link from 'next/link';

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Helper to render inline markdown: **bold**, `code`, [link](url), *italic*
export function renderInline(text) {
  if (!text) return null;

  // Split by link syntax [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const linkText = match[1];
    const linkHref = match[2];
    parts.push({ type: 'link', text: linkText, href: linkHref });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.map((part, pIdx) => {
    if (typeof part === 'object' && part.type === 'link') {
      const isInternal = part.href.startsWith('/') || part.href.startsWith('#');
      if (isInternal) {
        return (
          <Link
            key={pIdx}
            href={part.href}
            className="text-primary font-medium underline underline-offset-4 hover:opacity-85 transition-opacity"
          >
            {part.text}
          </Link>
        );
      }
      return (
        <a
          key={pIdx}
          href={part.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium underline underline-offset-4 hover:opacity-85 transition-opacity"
        >
          {part.text}
        </a>
      );
    }

    // Process bold (**), italic (*), and code (`) in raw text
    return renderFormattedText(part, pIdx);
  });
}

function renderFormattedText(textChunk, keyPrefix) {
  // Regex to match code blocks `...`, bold **...**, italic *...*
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const tokens = textChunk.split(tokenRegex);

  return (
    <React.Fragment key={keyPrefix}>
      {tokens.map((token, idx) => {
        if (!token) return null;
        if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
          return (
            <code
              key={idx}
              className="px-1.5 py-0.5 rounded-md bg-muted text-foreground font-mono text-xs sm:text-sm border border-border/70"
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
          return (
            <strong key={idx} className="font-semibold text-foreground">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
          return <em key={idx} className="italic text-foreground/90">{token.slice(1, -1)}</em>;
        }
        return token;
      })}
    </React.Fragment>
  );
}

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  const rawLines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // Empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Code blocks ```
    if (trimmed.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
        codeLines.push(rawLines[i]);
        i++;
      }
      i++; // consume closing ```
      elements.push(
        <div
          key={`code-${i}`}
          className="my-6 rounded-xl border border-border/80 bg-muted/40 p-4 font-mono text-sm overflow-x-auto text-foreground"
        >
          <pre>{codeLines.join('\n')}</pre>
        </div>
      );
      continue;
    }

    // Markdown Table (lines starting with |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith('|') && rawLines[i].trim().endsWith('|')) {
        tableLines.push(rawLines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        // Skip index 1 if it's separator like |--|--|
        const startIndex = tableLines[1].replace(/[-|:\s]/g, '').length === 0 ? 2 : 1;
        const bodyRows = tableLines.slice(startIndex).map((row) =>
          row
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim())
        );

        elements.push(
          <div key={`table-${i}`} className="my-8 overflow-x-auto rounded-xl border border-border/70 shadow-xs">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-muted/60 text-foreground font-semibold border-b border-border/70">
                <tr>
                  {headerRow.map((h, hIdx) => (
                    <th key={hIdx} className="px-4 py-3 border-r border-border/40 last:border-r-0">
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 bg-card">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-3 border-r border-border/40 last:border-r-0 text-muted-foreground">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      const headingText = trimmed.replace(/^####\s+/, '');
      const id = slugify(headingText);
      elements.push(
        <h4 key={`h4-${i}`} id={id} className="text-lg font-semibold tracking-tight text-foreground mt-6 mb-2 scroll-mt-24">
          {renderInline(headingText)}
        </h4>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      const headingText = trimmed.replace(/^###\s+/, '');
      const id = slugify(headingText);
      elements.push(
        <h3 key={`h3-${i}`} id={id} className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mt-8 mb-3 scroll-mt-24">
          {renderInline(headingText)}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      const headingText = trimmed.replace(/^##\s+/, '');
      const id = slugify(headingText);
      elements.push(
        <h2
          key={`h2-${i}`}
          id={id}
          className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-10 mb-4 pb-2 border-b border-border/60 scroll-mt-24"
        >
          {renderInline(headingText)}
        </h2>
      );
      i++;
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={`hr-${i}`} className="my-8 border-border/60" />);
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      const quoteLines = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith('>')) {
        quoteLines.push(rawLines[i].trim().replace(/^>\s*/, ''));
        i++;
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-4 border-primary/50 bg-muted/25 px-5 py-4 my-6 rounded-r-xl text-foreground italic shadow-xs"
        >
          {renderInline(quoteLines.join(' '))}
        </blockquote>
      );
      continue;
    }

    // Unordered List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const listItems = [];
      while (i < rawLines.length && (rawLines[i].trim().startsWith('- ') || rawLines[i].trim().startsWith('* '))) {
        listItems.push(rawLines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 mb-6 ml-6 list-disc text-muted-foreground text-base sm:text-lg leading-relaxed">
          {listItems.map((item, lIdx) => (
            <li key={lIdx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems = [];
      while (i < rawLines.length && /^\d+\.\s+/.test(rawLines[i].trim())) {
        listItems.push(rawLines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 mb-6 ml-6 list-decimal text-muted-foreground text-base sm:text-lg leading-relaxed">
          {listItems.map((item, lIdx) => (
            <li key={lIdx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular Paragraph
    const paragraphLines = [];
    while (
      i < rawLines.length &&
      rawLines[i].trim() &&
      !rawLines[i].trim().startsWith('#') &&
      !rawLines[i].trim().startsWith('- ') &&
      !rawLines[i].trim().startsWith('* ') &&
      !/^\d+\.\s+/.test(rawLines[i].trim()) &&
      !rawLines[i].trim().startsWith('>') &&
      !rawLines[i].trim().startsWith('|') &&
      !rawLines[i].trim().startsWith('```') &&
      rawLines[i].trim() !== '---'
    ) {
      paragraphLines.push(rawLines[i].trim());
      i++;
    }

    if (paragraphLines.length > 0) {
      elements.push(
        <p key={`p-${i}`} className="text-muted-foreground leading-relaxed mb-5 text-base sm:text-lg">
          {renderInline(paragraphLines.join(' '))}
        </p>
      );
    }
  }

  return <div className="prose-clean">{elements}</div>;
}
