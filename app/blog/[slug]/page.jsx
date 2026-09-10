import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/data/blogPosts';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import ArticleActions from '@/components/blog/ArticleActions';
import TableOfContents from '@/components/blog/TableOfContents';
import FaqAccordion from '@/components/blog/FaqAccordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Sparkles,
  BookOpen,
  Home,
} from 'lucide-react';

const BASE_URL = 'https://anantastra.vercel.app';

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Article Not Found | AnantAstra',
      description: 'The requested technical guide or financial article could not be found.',
    };
  }

  const canonicalUrl = `${BASE_URL}/blog/${post.slug}`;
  const title = `${post.metaTitle || post.title} | AnantAstra`;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    keywords: post.keywords || [],
    authors: [{ name: post.author || 'AnantAstra Technical Team' }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'AnantAstra',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'AnantAstra Technical Team'],
      tags: post.keywords || [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Find related articles (same category, excluding current post)
  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && (p.category === post.category || true)
  ).slice(0, 3);

  // Structured Data Schema Objects
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AnantAstra',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/globe.svg`,
      },
    },
    keywords: post.keywords ? post.keywords.join(', ') : '',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${BASE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${BASE_URL}/blog/${post.slug}`,
      },
    ],
  };

  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {/* JSON-LD Structured Data for Google / Bing SEO & AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap"
        >
          <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <Home className="size-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="size-3.5 shrink-0 opacity-60" />
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <ChevronRight className="size-3.5 shrink-0 opacity-60" />
          <span className="text-foreground/80 font-medium truncate max-w-xs sm:max-w-md">
            {post.title}
          </span>
        </nav>

        {/* Header Block */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <Badge variant="subtle" className="text-xs px-3 py-1 font-medium">
              {post.category}
            </Badge>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              <span>{post.readTime}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5" />
              <time dateTime={post.date}>{post.date}</time>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-4xl">
            {post.excerpt}
          </p>

          {/* Author info pill */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/50">
            <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              {post.author ? post.author[0] : 'A'}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{post.author}</div>
              <div className="text-xs text-muted-foreground">{post.authorRole}</div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border/50 hidden sm:flex">
              <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Zero-Telemetry Audited</span>
            </div>
          </div>

          {/* Direct Interactive Tool Callout (Top Hero) */}
          {post.tool && (
            <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5 sm:mt-0">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Live Interactive Utility
                  </div>
                  <div className="text-base sm:text-lg font-bold text-foreground">
                    Try {post.tool.name} Online
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Free, instant calculations running 100% in your browser.
                  </div>
                </div>
              </div>

              <Button asChild variant="default" size="sm" className="shrink-0 w-full sm:w-auto">
                <Link href={post.tool.url} className="gap-2">
                  <span>{post.tool.cta || 'Launch Tool'}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}

          {/* Share and Reading Progress Action Bar */}
          <ArticleActions title={post.title} url={`${BASE_URL}/blog/${post.slug}`} />
        </header>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Body */}
          <div className="lg:col-span-8 min-w-0">
            {/* Parsed Markdown Body */}
            <MarkdownRenderer content={post.content} />

            {/* Bottom Tool CTA Banner */}
            {post.tool && (
              <Card className="my-10 border-border/80 bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-1">
                    <Sparkles className="size-4" />
                    <span>Run Computations Client-Side</span>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">
                    Ready to use the {post.tool.name}?
                  </CardTitle>
                  <CardDescription className="text-sm">
                    No sign-up, no server storage, and zero tracking cookies. Test your figures right now.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-3">
                  <Button asChild variant="default">
                    <Link href={post.tool.url} className="gap-2">
                      <span>{post.tool.cta || 'Open Calculator'}</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/tools" className="gap-2">
                      <span>Browse All 24+ Tools</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* FAQs Accordion for Rich Results */}
            {post.faqs && post.faqs.length > 0 && <FaqAccordion faqs={post.faqs} />}

            {/* Keywords and Search Intent Tags */}
            {post.keywords && post.keywords.length > 0 && (
              <div className="my-8 pt-6 border-t border-border/60">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Related Search Topics & Keywords
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.keywords.map((kw, kIdx) => (
                    <Badge key={kIdx} variant="outline" className="text-xs font-normal py-1 px-2.5">
                      #{kw}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Author Guarantee Card */}
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-6 my-8">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {post.author ? post.author[0] : 'A'}
                </div>
                <div>
                  <div className="text-base font-bold text-foreground">{post.author}</div>
                  <div className="text-xs text-muted-foreground mb-2">{post.authorRole}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Published by AnantAstra's engineering and research desk. All calculations, privacy guarantees, and algorithms referenced in this article are open-source and run client-side in the browser.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles Section */}
            {relatedPosts.length > 0 && (
              <div className="my-12 pt-8 border-t border-border/60">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="size-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Recommended Further Reading</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedPosts.map((rel) => (
                    <Card
                      key={rel.slug}
                      className="group hover:border-primary/50 transition-all duration-200 flex flex-col justify-between"
                    >
                      <CardHeader className="p-5 pb-3">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Badge variant="subtle" className="text-xs py-0.5 px-2 font-normal">
                            {rel.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{rel.readTime}</span>
                        </div>
                        <CardTitle className="text-base font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {rel.excerpt}
                        </p>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto text-xs text-primary font-medium hover:bg-transparent"
                        >
                          <Link href={`/blog/${rel.slug}`} className="flex items-center gap-1">
                            <span>Read Guide</span>
                            <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar (Desktop) */}
          <aside className="lg:col-span-4 hidden lg:block space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Dynamic Table of Contents */}
              <TableOfContents content={post.content} />

              {/* Quick Tool Launch Widget */}
              {post.tool && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-2">
                    <Sparkles className="size-4" />
                    <span>Instant Calculation</span>
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-1">{post.tool.name}</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Zero server requests. All computations run right in your browser thread.
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link href={post.tool.url} className="gap-2">
                      <span>{post.tool.cta || 'Launch Utility'}</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              )}

              {/* All Tools Navigation Card */}
              <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                <h4 className="text-sm font-bold text-foreground mb-1">AnantAstra Toolbox</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Explore 24+ free, privacy-first developer utilities and financial calculators.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/tools" className="gap-2">
                    <span>View All Tools</span>
                    <ExternalLink className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
