import { allBlogArticles } from "@/data/legacy-articles";
import { SITE_URL, SITE_NAME } from "@/lib/site";

/**
 * RSS 2.0 feed for the blog — /feed.xml
 *
 * Discovery layer for crawlers, aggregators, feed readers and AI answer
 * engines. Content is static data, so the feed is fully static too and costs
 * nothing at runtime.
 */

export const dynamic = "force-static";

const FEED_LIMIT = 50;

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET(): Promise<Response> {
  const posts = allBlogArticles().slice(0, FEED_LIMIT);
  const lastBuild = posts.length ? new Date(posts[0].publishedAt).toUTCString() : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blogs/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Shopify QA Blog</title>
    <link>${SITE_URL}/blogs</link>
    <description>Shopify QA case studies, conversion teardowns and testing guides from 100+ audited storefronts.</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
