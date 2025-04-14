import Link from "next/link";
import Image from "next/image";

export default function Blog() {
  // Blog posts array
  const blogPosts = [
    {
      slug: "is-anantastra-really-open-source",
      title: "Is Anantastra Really Open Source?",
      excerpt: "Learn about Anantastra's commitment to open source software, how we handle your privacy, and what open source really means for users and developers.",
      date: "April 14, 2025",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop",
      authorInitial: "A",
      tags: ["Open Source", "Privacy", "Data Security"]
    },
    // More blog posts will be added here in the future
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Anantastra Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Insights about open source, privacy, and the tools we build to make your digital life easier
        </p>
      </div>

      {/* Featured Post */}
      {blogPosts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Featured Post</h2>
          <Link href={`/blog/${blogPosts[0].slug}`} className="block group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-full">
                <Image 
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title} 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-7 p-6 lg:p-8">
                <div className="flex items-center mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold mr-2">
                      {blogPosts[0].authorInitial}
                    </div>
                    <span>Anantastra Team</span>
                  </div>
                  <span className="mx-3">•</span>
                  <time dateTime="2025-04-14">{blogPosts[0].date}</time>
                  <span className="mx-3">•</span>
                  <span>{blogPosts[0].readTime}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {blogPosts[0].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-5">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {blogPosts[0].tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* All Posts */}
      {blogPosts.length > 1 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">All Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="relative h-48">
                    <Image 
                      src={post.image}
                      alt={post.title} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center mb-3 text-xs text-gray-600 dark:text-gray-400">
                      <time dateTime="2025-04-14">{post.date}</time>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {post.excerpt.length > 120 ? `${post.excerpt.substring(0, 120)}...` : post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Stay tuned for more posts coming soon!</p>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-16 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-3">Subscribe to Our Newsletter</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-0">
              Get the latest updates about our tools, privacy best practices, and open source initiatives 
              delivered straight to your inbox.
            </p>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
                Subscribe
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}