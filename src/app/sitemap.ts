import type { MetadataRoute } from "next";
import { getAllProjects } from "@/data/projects";
import { staticBlogPosts } from "@/data/blogs";
import { articles, articleStubs, ARTICLE_CATEGORIES } from "@/data/articles";
import { categorySlug } from "@/components/blog/categories";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const PAGE_SIZE = 12;

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/work`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/audit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/work/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p.featured ? 0.8 : 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = staticBlogPosts.map((p) => ({
    url: `${BASE_URL}/blogs/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: p.trending ? 0.8 : 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/blogs/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: a.featured ? 0.8 : 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = ARTICLE_CATEGORIES.map((c) => {
    const slug = categorySlug(c);
    const count = articleStubs.filter((a) => a.category === c).length;
    const pages = Math.ceil(count / PAGE_SIZE);
    const routes: MetadataRoute.Sitemap = [
      { url: `${BASE_URL}/blogs/category/${slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.75 },
    ];
    for (let n = 2; n <= pages; n++) {
      routes.push({ url: `${BASE_URL}/blogs/category/${slug}/page/${n}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 });
    }
    return routes;
  }).flat();

  const indexPages = Math.ceil((articles.length + staticBlogPosts.length) / PAGE_SIZE);
  const pageIndexRoutes: MetadataRoute.Sitemap = [];
  for (let n = 2; n <= indexPages; n++) {
    pageIndexRoutes.push({ url: `${BASE_URL}/blogs/page/${n}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 });
  }

  return [...staticRoutes, ...categoryRoutes, ...pageIndexRoutes, ...projectRoutes, ...blogRoutes, ...articleRoutes];
}
