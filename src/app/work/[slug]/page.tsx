import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/data/projects";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { getArticlesByProject, getRelatedArticles, stubOf } from "@/data/articles";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, absoluteUrl } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.seo.title || `${project.title} — QA Case Study`,
    description: project.seo.description || project.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: project.seo.title || project.title,
      description: project.seo.description || project.summary,
      type: "article",
      url: absoluteUrl(`/work/${slug}`),
      images: [project.seo.image || project.heroImage].filter(Boolean),
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo.title || project.title,
      description: project.seo.description || project.summary,
    },
  };
}

export default async function CaseStudyRoute({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = getAllProjects();
  const related = allProjects
    .filter((p) => p.slug !== slug && (p.industry === project!.industry || p.platform === project!.platform))
    .slice(0, 3);

  const own = getArticlesByProject(slug);
  const anchor = own.find((a) => a.articleType === "case-study") ?? own[0];
  const relatedArticles = anchor ? getRelatedArticles(anchor, 4) : own.slice(0, 4).map((a) => stubOf(a));

  const url = absoluteUrl(`/work/${project.slug}`);
  const p = project!;

  // Case studies are the commercial pages: Article + BreadcrumbList markup
  // makes them eligible for rich results and tells Google what the page is
  // about beyond the copy.
  const caseStudyLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.seo.title || `${p.title} — QA Case Study`,
    description: p.seo.description || p.summary,
    image: [p.seo.image || p.heroImage].filter(Boolean),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    articleSection: "QA case study",
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: {
      "@type": "Thing",
      name: `${p.industry} e-commerce quality assurance`,
    },
    keywords: p.technologies.join(", "),
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Work", item: absoluteUrl("/work") },
      { "@type": "ListItem", position: 3, name: p.title, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={[caseStudyLd, breadcrumbsLd]} />
      <CaseStudyPage project={p} related={related} relatedArticles={relatedArticles} />
    </>
  );
}
