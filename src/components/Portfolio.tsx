import { useState } from 'react';
import noImageFallback from '../assets/NO_IMAGE.png';

interface DescriptionItem {
	text: string;
	url?: string;
}

interface Project {
	slug: string;
	title: string;
	description: string | Array<string | DescriptionItem>;
	githubUrl?: string;
	renderUrl?: string;
	techStack: string[];
	imageSrc?: string;
}

interface Props {
	projects: Project[];
}

const chunkPairs = <T,>(items: T[]): T[][] => {
	const pairs: T[][] = [];
	for (let i = 0; i < items.length; i += 2) {
		pairs.push(items.slice(i, i + 2));
	}
	return pairs;
};

export const Portfolio = ({ projects }: Props) => {
	const [openSlug, setOpenSlug] = useState<string | null>(null);
	const spreads = chunkPairs(projects);
	const selected = projects.find((project) => project.slug === openSlug);

	return (
		<>
			{spreads.map((spread, index) => (
				<section
					key={spread.map((project) => project.slug).join('-')}
					id={index === 0 ? 'portfolio' : undefined}
					className="bg-accent/10 min-h-screen snap-start flex items-center justify-center"
				>
					<div className="flex flex-col items-center justify-center gap-6 w-6xl self-stretch px-4 py-12 text-center">
						{index === 0 && (
							<h2 className="font-heading text-3xl font-bold text-accent border-b-2 border-accent pb-1 inline-block">
								第二章 作品集
							</h2>
						)}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
							{spread.map((project) => (
								<button
									key={project.slug}
									type="button"
									onClick={() => setOpenSlug(project.slug)}
									className="paper rounded-lg shadow-md p-6 text-left cursor-pointer transition hover:shadow-lg"
								>
									<img
										src={project.imageSrc ?? noImageFallback}
										alt={project.title}
										className="rounded w-full aspect-video object-cover mb-4"
									/>
									<h3 className="text-xl font-bold">{project.title}</h3>
								</button>
							))}
						</div>
					</div>
				</section>
			))}

			{selected && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 animate-in fade-in duration-200"
					onClick={() => setOpenSlug(null)}
				>
					<div
						className="paper relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-xl p-8 text-left animate-in fade-in zoom-in-95 duration-300"
						onClick={(event) => event.stopPropagation()}
					>
						<button
							type="button"
							aria-label="閉じる"
							onClick={() => setOpenSlug(null)}
							className="absolute top-4 right-4 h-8 w-8 cursor-pointer text-xl leading-none"
						>
							×
						</button>
						<div className="space-y-4">
							<img
								src={selected.imageSrc ?? noImageFallback}
								alt={selected.title}
								className="rounded w-full aspect-video object-cover"
							/>
							<h3 className="text-2xl font-bold">{selected.title}</h3>
							{Array.isArray(selected.description) ? (
								<ul className="space-y-2 leading-relaxed">
									{selected.description.map((item) => {
										const { text, url } = typeof item === 'string' ? { text: item, url: undefined } : item;
										return (
											<li key={text} className="flex items-center gap-2">
												<span className="before:content-['・'] before:mr-1">{text}</span>
												{url && (
													<a
														href={url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-xs px-2 py-1 bg-accent text-bg rounded hover:opacity-90 transition"
													>
														Link
													</a>
												)}
											</li>
										);
									})}
								</ul>
							) : (
								<p className="leading-relaxed">{selected.description}</p>
							)}
							<div className="flex flex-wrap gap-2">
								{selected.techStack.map((tech) => (
									<span key={tech} className="text-xs px-2 py-1 bg-accent/20 rounded">
										{tech}
									</span>
								))}
							</div>
							<div className="flex gap-4 pt-2">
								{selected.githubUrl && (
									<a
										href={selected.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="px-4 py-2 bg-accent text-bg rounded hover:opacity-90 transition"
									>
										GitHub
									</a>
								)}
								{selected.renderUrl && (
									<a
										href={selected.renderUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="px-4 py-2 bg-accent text-bg rounded hover:opacity-90 transition"
									>
										Link
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Portfolio;
