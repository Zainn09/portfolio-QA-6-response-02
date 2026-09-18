import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/data/projects";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { getArticlesByProject, getRelatedArticles, stubOf } from "@/data/articles";

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

  return <CaseStudyPage project={project!} related={related} relatedArticles={relatedArticles} />;
}
