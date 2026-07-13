import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '@nanostores/react';
import noImageFallback from '../assets/NO_IMAGE.png';
import { $activeChapterId, $innerIndex, setChapterPageCount } from '../stores/book';

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

const chunkGroups = <T,>(items: T[], size: number): T[][] => {
	const groups: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		groups.push(items.slice(i, i + size));
	}
	return groups;
};

export const Portfolio = ({ projects }: Props) => {
	const [openSlug, setOpenSlug] = useState<string | null>(null);
	const spreads = chunkGroups(projects, 4);
	const selected = projects.find((project) => project.slug === openSlug);

	const activeChapterId = useStore($activeChapterId);
	const innerIndex = useStore($innerIndex);
	const rowRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setChapterPageCount('portfolio', spreads.length);
	}, [spreads.length]);

	useEffect(() => {
		document.body.dataset.modalOpen = selected ? 'true' : 'false';
		return () => {
			delete document.body.dataset.modalOpen;
		};
	}, [selected]);

	const pageIndex = activeChapterId === 'portfolio' ? Math.min(innerIndex, spreads.length - 1) : 0;

	useEffect(() => {
		const row = rowRef.current;
		if (!row) return;
		const applyTransform = () => {
			const pageWidth = row.clientWidth;
			row.style.transform = `translateX(-${pageIndex * pageWidth}px)`;
		};
		applyTransform();
		window.addEventListener('resize', applyTransform);
		return () => window.removeEventListener('resize', applyTransform);
	}, [pageIndex]);

	return (
		<section
			id="portfolio"
			className="chapter-slide relative flex items-center justify-center overflow-hidden p-4 md:p-8"
			data-chapter="portfolio"
		>
			<div ref={rowRef} className="flex h-full w-full max-w-6xl transition-transform duration-400 ease-in-out">
				{spreads.map((spread, index) => (
					<div
						key={spread.map((project) => project.slug).join('-')}
						className="paper relative h-full w-full shrink-0 overflow-hidden rounded-lg shadow-2xl"
					>
						<div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-6 -translate-x-1/2 bg-gradient-to-r from-black/15 via-black/25 to-black/15 blur-sm md:block" />
						<div className="flex h-full w-full flex-col overflow-hidden p-8 md:px-16 md:py-8">
							{index === 0 && (
								<h2 className="font-heading text-3xl font-bold border-b-2 border-accent pb-1 mb-4 inline-block self-start">
									第二章 作品集
								</h2>
							)}
							<div className="grid flex-1 grid-cols-1 gap-x-12 gap-y-4 overflow-hidden md:grid-cols-2">
								{[spread.slice(0, 2), spread.slice(2, 4)].map((column, columnIndex) => (
									<div key={columnIndex} className="flex flex-col gap-4">
										{column.map((project) => (
											<button
												key={project.slug}
												type="button"
												onClick={() => setOpenSlug(project.slug)}
												className="block w-full rounded-lg p-2 text-left shadow-md transition hover:shadow-lg"
											>
												<img
													src={project.imageSrc ?? noImageFallback.src}
													alt={project.title}
													className="rounded w-full h-32 object-cover mb-2 md:h-36"
												/>
												<h3 className="text-lg font-bold">{project.title}</h3>
											</button>
										))}
									</div>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			{selected &&
				createPortal(
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
									src={selected.imageSrc ?? noImageFallback.src}
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
					</div>,
				document.body,
			)}
		</section>
	);
};

export default Portfolio;
