import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get all blog posts (if you have a blog model)
    // const blogPosts = await prisma.blogPost.findMany({
    //   select: {
    //     slug: true,
    //     updatedAt: true,
    //   },
    // })

    // Static pages
    const staticPages = [
      { url: "", lastmod: new Date(), changefreq: "monthly", priority: 1.0 },
      { url: "about", lastmod: new Date(), changefreq: "monthly", priority: 0.8 },
      { url: "features", lastmod: new Date(), changefreq: "monthly", priority: 0.8 },
      { url: "pricing", lastmod: new Date(), changefreq: "monthly", priority: 0.8 },
      { url: "blog", lastmod: new Date(), changefreq: "weekly", priority: 0.7 },
      { url: "login", lastmod: new Date(), changefreq: "yearly", priority: 0.5 },
      { url: "register", lastmod: new Date(), changefreq: "yearly", priority: 0.5 },
      { url: "terms", lastmod: new Date(), changefreq: "yearly", priority: 0.3 },
      { url: "privacy", lastmod: new Date(), changefreq: "yearly", priority: 0.3 },
      { url: "contact", lastmod: new Date(), changefreq: "yearly", priority: 0.5 },
    ]

    // Generate XML
    const baseUrl = "https://resumeRise.techxavvy.in"

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    // Add static pages
    staticPages.forEach((page) => {
      xml += "  <url>\n"
      xml += `    <loc>${baseUrl}/${page.url}</loc>\n`
      xml += `    <lastmod>${page.lastmod.toISOString().split("T")[0]}</lastmod>\n`
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`
      xml += `    <priority>${page.priority}</priority>\n`
      xml += "  </url>\n"
    })

    // Add blog posts
    // blogPosts.forEach((post) => {
    //   xml += '  <url>\n'
    //   xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`
    //   xml += `    <lastmod>${post.updatedAt.toISOString().split('T')[0]}</lastmod>\n`
    //   xml += '    <changefreq>monthly</changefreq>\n'
    //   xml += '    <priority>0.6</priority>\n'
    //   xml += '  </url>\n'
    // })

    xml += "</urlset>"

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return NextResponse.json({ error: "Failed to generate sitemap" }, { status: 500 })
  }
}
