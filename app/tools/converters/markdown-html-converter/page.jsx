"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function MarkdownHTMLConverter() {
  const [markdownInput, setMarkdownInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [previewMode, setPreviewMode] = useState("preview"); // preview, raw
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (markdownInput) {
      convertMarkdownToHtml();
    }
  }, [markdownInput]);

  const convertMarkdownToHtml = () => {
    // Basic markdown to HTML conversion
    let html = markdownInput;

    // Convert headers
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
    html = html.replace(/^###### (.*$)/gm, '<h6>$1</h6>');

    // Convert blockquotes
    html = html.replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>');

    // Convert bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\_\_(.*?)\_\_/g, '<strong>$1</strong>');
    html = html.replace(/\_(.*?)\_/g, '<em>$1</em>');

    // Convert code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert links
    html = html.replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Convert images
    html = html.replace(/!\[([^\[]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');

    // Convert unordered lists
    let inList = false;
    let listLines = html.split('\n').map(line => {
      if (line.match(/^- (.+)/)) {
        const content = line.replace(/^- (.+)/, '$1');
        if (!inList) {
          inList = true;
          return `<ul>\n<li>${content}</li>`;
        }
        return `<li>${content}</li>`;
      } else if (inList) {
        inList = false;
        return `</ul>\n${line}`;
      } else {
        return line;
      }
    });
    if (inList) {
      listLines.push('</ul>');
    }
    html = listLines.join('\n');
    
    // Convert ordered lists
    inList = false;
    listLines = html.split('\n').map(line => {
      if (line.match(/^\d+\. (.+)/)) {
        const content = line.replace(/^\d+\. (.+)/, '$1');
        if (!inList) {
          inList = true;
          return `<ol>\n<li>${content}</li>`;
        }
        return `<li>${content}</li>`;
      } else if (inList) {
        inList = false;
        return `</ol>\n${line}`;
      } else {
        return line;
      }
    });
    if (inList) {
      listLines.push('</ol>');
    }
    html = listLines.join('\n');

    // Convert horizontal rules
    html = html.replace(/^---$/gm, '<hr />');
    
    // Convert paragraphs
    // We need to be careful not to convert lines that already have HTML tags
    const paragraphs = html.split('\n\n');
    html = paragraphs
      .map(paragraph => {
        // Skip if this is already HTML content
        if (paragraph.trim().startsWith('<')) return paragraph;
        
        // Skip empty lines
        if (!paragraph.trim()) return '';
        
        // Wrap in paragraph tags
        return `<p>${paragraph}</p>`;
      })
      .join('\n\n');

    setHtmlOutput(html);
  };

  const copyHtmlToClipboard = () => {
    if (htmlOutput) {
      navigator.clipboard.writeText(htmlOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExampleClick = () => {
    const example = `# Markdown Example

## Headers

### This is an H3

#### This is an H4

## Formatting

**Bold text** and *italic text*

__Also bold__ and _also italic_

## Lists

### Unordered List
- Item 1
- Item 2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item

## Links and Images

[Visit GitHub](https://github.com)

![Markdown Logo](https://markdown-here.com/img/icon256.png)

## Blockquotes

> This is a blockquote

## Code

Inline \`code\` example

\`\`\`
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`

## Horizontal Rule

---

That's it!`;

    setMarkdownInput(example);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Markdown to HTML Converter</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Markdown Input</h2>
            <Button
              onClick={handleExampleClick}
              variant="outline"
              size="sm"
            >
              Load Example
            </Button>
          </div>
          
          <textarea
            value={markdownInput}
            onChange={(e) => setMarkdownInput(e.target.value)}
            placeholder="Type or paste your Markdown here..."
            className="w-full h-80 p-4 font-mono text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">HTML Output</h2>
            <div className="flex items-center gap-2">
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setPreviewMode("preview")}
                  className={`px-3 py-1 text-sm font-medium rounded-l-md ${
                    previewMode === "preview"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white dark:bg-gray-700"
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setPreviewMode("raw")}
                  className={`px-3 py-1 text-sm font-medium rounded-r-md ${
                    previewMode === "raw"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white dark:bg-gray-700"
                  }`}
                >
                  Raw HTML
                </button>
              </div>
              
              <Button
                onClick={copyHtmlToClipboard}
                variant="outline"
                size="sm"
                disabled={!htmlOutput}
              >
                {copied ? "Copied!" : "Copy HTML"}
              </Button>
            </div>
          </div>
          
          {previewMode === "preview" ? (
            <div 
              className="w-full h-80 p-4 overflow-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            />
          ) : (
            <pre className="w-full h-80 p-4 overflow-auto font-mono text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
              {htmlOutput}
            </pre>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Markdown Cheat Sheet</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Syntax</h3>
            <table className="min-w-full text-sm">
              <tbody>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-2 font-mono"># Heading 1</td>
                  <td className="py-2">&rarr; <code>&lt;h1&gt;</code></td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-2 font-mono">## Heading 2</td>
                  <td className="py-2">&rarr; <code>&lt;h2&gt;</code></td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-2 font-mono">**Bold**</td>
                  <td className="py-2">&rarr; <code>&lt;strong&gt;</code></td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-2 font-mono">*Italic*</td>
                  <td className="py-2">&rarr; <code>&lt;em&gt;</code></td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">[Link](url)</td>
                  <td className="py-2">&rarr; <code>&lt;a href="url"&gt;</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Extended Syntax</h3>
            <table className="min-w-full text-sm">
              <tbody>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-2 font-mono">- Item</td>
                  <td className="py-2">&rarr; Unordered list</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-2 font-mono">1. Item</td>
                  <td className="py-2">&rarr; Ordered list</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-2 font-mono">\`code\`</td>
                  <td className="py-2">&rarr; Inline code</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-2 font-mono">\`\`\`code block\`\`\`</td>
                  <td className="py-2">&rarr; Code block</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">![Alt](img-url)</td>
                  <td className="py-2">&rarr; Image</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}