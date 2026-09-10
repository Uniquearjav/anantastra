"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  X,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function BlogIndexClient({ posts = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories list with counts
  const categories = useMemo(() => {
    const list = ['All', 'Financial', 'Developer', 'Science & Health', 'Security', 'Mathematics'];
    return list.map((cat) => {
      const count = cat === 'All' ? posts.length : posts.filter((p) => p.category === cat).length;
      return { name: cat, count };
    });
  }, [posts]);

  // Filtered and searched posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;

      if (!searchQuery.trim()) {
        return matchesCategory;
      }

      const q = searchQuery.toLowerCase().trim();
      const inTitle = post.title?.toLowerCase().includes(q);
      const inExcerpt = post.excerpt?.toLowerCase().includes(q);
      const inCategory = post.category?.toLowerCase().includes(q);
      const inKeywords = post.keywords?.some((k) => k.toLowerCase().includes(q));

      return matchesCategory && (inTitle || inExcerpt || inCategory || inKeywords);
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    if (selectedCategory === 'All' && !searchQuery.trim() && posts.length > 0) {
      return posts[0];
    }
    return null;
  }, [posts, selectedCategory, searchQuery]);

  const displayPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.slice(1);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Header */}
      <section className="text-center max-w-4xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-muted/30 text-xs font-medium text-foreground mb-4">
          <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Privacy-First Knowledge Base • Zero Telemetry</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
          AnantAstra Technical & Financial Guides
        </h1>

        <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Explore in-depth benchmarks, income tax calculators, cryptography deep dives, and algorithm explanations. Fully open source and client-side.
        </p>
      </section>

      {/* Search and Category Filter Toolbar */}
      <section className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search 25+ articles by title, topic, or keyword (e.g., GST, EMI, Passwords, JSON)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-11 text-sm bg-card border-border/70 rounded-xl shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-foreground text-background shadow-xs'
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border/50'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-background/20 text-background'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Guide Banner (Shown when no search query and on 'All') */}
      {featuredPost && (
        <section className="pt-2">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
            <TrendingUp className="size-4" />
            <span>Featured Analysis</span>
          </div>

          <Card className="group border-border/80 bg-card overflow-hidden hover:border-primary/40 transition-all duration-300">
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <Badge variant="subtle" className="text-xs px-2.5 py-0.5 font-medium">
                  {featuredPost.category}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>{featuredPost.readTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <time dateTime={featuredPost.date}>{featuredPost.date}</time>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                {featuredPost.excerpt}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
                {featuredPost.tool ? (
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Sparkles className="size-3.5 text-primary" />
                    <span>Includes interactive tool: </span>
                    <Link
                      href={featuredPost.tool.url}
                      className="text-primary hover:underline font-semibold"
                    >
                      {featuredPost.tool.name}
                    </Link>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    By {featuredPost.author}
                  </div>
                )}

                <Button asChild size="sm" className="gap-2 shrink-0">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <span>Read Complete Guide</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* All / Filtered Posts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {searchQuery ? `Search Results (${filteredPosts.length})` : `${selectedCategory} Articles`}
          </h2>
          <span className="text-xs text-muted-foreground">
            Showing {filteredPosts.length} of {posts.length} articles
          </span>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border/70 bg-card">
            <Filter className="size-10 text-muted-foreground/60 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No articles found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              We could not find any articles matching &quot;{searchQuery}&quot; in the &quot;{selectedCategory}&quot; category.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPosts.map((post) => (
              <Card
                key={post.slug}
                className="group flex flex-col justify-between border-border/70 bg-card hover:border-border/90 hover:shadow-sm transition-all duration-200"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <Badge variant="subtle" className="text-xs py-0.5 px-2 font-normal">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <CardTitle className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mt-2">
                    {post.excerpt}
                  </p>
                </CardHeader>

                <CardContent className="p-5 pt-0">
                  {/* Tool link snippet if exists */}
                  {post.tool && (
                    <div className="mb-4 pt-3 border-t border-border/40">
                      <Link
                        href={post.tool.url}
                        className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                      >
                        <Sparkles className="size-3" />
                        <span className="truncate">Try {post.tool.name}</span>
                      </Link>
                    </div>
                  )}

                  {/* Read article CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
                    <span className="text-muted-foreground">{post.date}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-primary font-semibold group-hover:underline"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer Support Banner */}
      <section className="rounded-2xl border border-border/70 bg-muted/20 p-8 text-center max-w-4xl mx-auto mt-16">
        <h3 className="text-xl font-bold text-foreground mb-2">Need a Custom Calculation or Tool?</h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-6">
          AnantAstra is completely free and open-source. Have suggestions for new formulas, converters, or guides? Check out our GitHub project.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="default" size="sm">
            <Link href="/tools">Browse All 24+ Interactive Tools</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href="https://github.com/Uniquearjav/anantastra"
              target="_blank"
              rel="noopener noreferrer"
            >
              Star on GitHub
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
