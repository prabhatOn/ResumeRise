'use client'

import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, User, Calendar, Share2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getBlogPost, getRelatedPosts } from '@/lib/blog-data'
import type { BlogPost } from '@/lib/blog-data'
import ModernFooter from '@/components/modern-footer'
import { useParams } from 'next/navigation'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    if (!slug) return
    
    const blogPost = getBlogPost(slug)
    if (!blogPost) {
      notFound()
    }
    setPost(blogPost)
    setRelatedPosts(getRelatedPosts(slug, 3))
  }, [slug])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    const headings = document.querySelectorAll('h2, h3')
    headings.forEach((heading) => observer.observe(heading))

    return () => {
      headings.forEach((heading) => observer.unobserve(heading))
    }
  }, [post])

  if (!post) {
    return <div>Loading...</div>
  }

  const tableOfContents = post.content
    .split('\n')
    .filter(line => line.startsWith('## ') || line.startsWith('### '))
    .map(line => {
      const level = line.startsWith('## ') ? 2 : 3
      const text = line.replace(/^#{2,3}\s/, '')
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
      return { level, text, id }
    })
  const processContent = (content: string) => {
    return content
      .split('\n')
      .map((line) => {
        if (line.startsWith('## ')) {
          const text = line.replace('## ', '')
          const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
          return `<h2 id="${id}" class="text-3xl font-bold text-white mb-6 mt-12 first:mt-0">${text}</h2>`
        }
        if (line.startsWith('### ')) {
          const text = line.replace('### ', '')
          const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
          return `<h3 id="${id}" class="text-2xl font-semibold text-blue-200 mb-4 mt-8">${text}</h3>`
        }
        if (line.startsWith('- ')) {
          return `<li class="text-gray-300 mb-2">${line.replace('- ', '')}</li>`
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return `<p class="text-lg font-semibold text-blue-200 mb-4 mt-6">${line.replace(/\*\*/g, '')}</p>`
        }
        if (line.trim() === '') {
          return '<br>'
        }
        return `<p class="text-gray-300 mb-4 leading-relaxed">${line}</p>`
      })
      .join('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-md bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </div>
        </header>

        {/* Article */}
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Table of Contents */}
            <motion.aside
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-8">
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center mb-6">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Table of Contents</h3>
                  </div>
                  <nav className="space-y-2">
                    {tableOfContents.map((item, index) => (
                      <a
                        key={index}
                        href={`#${item.id}`}
                        className={`block text-sm transition-colors ${
                          activeSection === item.id
                            ? 'text-blue-400 font-medium'
                            : 'text-gray-400 hover:text-blue-300'
                        } ${item.level === 3 ? 'ml-4' : ''}`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </motion.aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Article Header */}
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">
                      {post.category}
                    </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {post.title}
                  </h1>
                  
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {post.readTime}
                    </div>
                    <button className="flex items-center hover:text-blue-400 transition-colors">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </button>
                  </div>
                </div>
              </motion.header>

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 mb-12"
              >
                <div
                  className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-blue-200"
                  dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
                />
              </motion.div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">Related Articles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.slug}
                        href={`/blog/${relatedPost.slug}`}
                        className="group"
                      >
                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300 group-hover:bg-white/10">
                          <div className="flex items-center mb-3">
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                              {relatedPost.category}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                            {relatedPost.title}
                          </h4>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                          <div className="text-xs text-gray-500">
                            {relatedPost.readTime}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>
          </div>
        </article>
      </div>

      <ModernFooter />
    </div>
  )
}
