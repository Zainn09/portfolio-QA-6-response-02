import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/data/projects";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";

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

  return <CaseStudyPage project={project!} related={related} />;
}
