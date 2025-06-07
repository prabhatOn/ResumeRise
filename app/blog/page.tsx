"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, BookOpen, TrendingUp, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { ModernHeader } from "@/components/modern-header"
import ModernFooter from "@/components/modern-footer"
import { getAllBlogPosts, getFeaturedPosts } from "@/lib/blog-data"

// Client component wrapper for blog page
export default function BlogPage() {
  return <BlogContent />
}

function BlogContent() {
  const blogPosts = getAllBlogPosts()
  const featuredPosts = getFeaturedPosts()

  const categoryColors = {
    Templates: "bg-blue-500/10 text-blue-400",
    Strategy: "bg-green-500/10 text-green-400", 
    Writing: "bg-purple-500/10 text-purple-400",
    ATS: "bg-orange-500/10 text-orange-400",
    Tools: "bg-pink-500/10 text-pink-400",
    'Career Tips': "bg-cyan-500/10 text-cyan-400"
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_50%,_theme(colors.blue.500/0.1),_transparent_70%),radial-gradient(circle_at_80%_50%,_theme(colors.violet.500/0.1),_transparent_70%),radial-gradient(circle_at_40%_80%,_theme(colors.emerald.500/0.1),_transparent_70%)]" />
      
      {/* Grid Overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMUg0MFYwSDBWMVoiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN0cCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9InRyYW5zcGFyZW50Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0idHJhbnNwYXJlbnQiLz4KPC9kZWZzPgo8L3N2Zz4K')] opacity-20" />

      <ModernHeader />

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                <BookOpen className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Career Insights & Tips</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Our Blog
              </h1>
              
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Latest articles, tips, and insights about resume optimization and job search strategies to help you land your dream job.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-sm text-gray-400">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-400">Readers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Weekly</div>
                  <div className="text-sm text-gray-400">Updates</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPosts.length > 0 && (
          <section className="py-16 px-6">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12"
              >
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Featured Article</h2>
                </div>
                
                <div className="glass rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 border border-white/10">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium border border-orange-500/20">
                        Featured
                      </div>
                      
                      <Link href={`/blog/${featuredPosts[0].slug}`}>
                        <h3 className="text-3xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer">
                          {featuredPosts[0].title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-400 text-lg leading-relaxed">
                        {featuredPosts[0].excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{featuredPosts[0].date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{featuredPosts[0].author}</span>
                        </div>
                        <span>{featuredPosts[0].readTime}</span>
                      </div>
                      
                      <Link href={`/blog/${featuredPosts[0].slug}`}>
                        <Button className="group bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0">
                          Read Article
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="relative">
                      <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center mx-auto">
                            <Sparkles className="h-8 w-8 text-white" />
                          </div>
                          <div className="text-sm text-gray-400">{featuredPosts[0].category}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-white mb-12 text-center">Latest Articles</h2>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post, index) => (
                  <motion.article
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="glass rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 group border border-white/5"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[post.category as keyof typeof categoryColors]}`}>
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">{post.readTime}</span>
                      </div>
                      
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <time dateTime={post.date}>{post.date}</time>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{post.author}</span>
                          </div>
                        </div>
                        
                        <Link href={`/blog/${post.slug}`}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-2"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass rounded-2xl p-8 text-center border border-white/10"
            >
              <div className="space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-white">Stay Updated</h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Get the latest articles, tips, and career insights delivered straight to your inbox. Join thousands of professionals who trust ResumeRise.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0 px-8">
                    Subscribe
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500">
                  No spam. Unsubscribe at any time.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <ModernFooter />
    </div>
  )
}
