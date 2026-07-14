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
	const pageGroups = chunkGroups(projects, 2); // 1ページ(モバイル画面1枚分) = 最大2作品
	const spreads = chunkGroups(pageGroups, 2); // 1見開き(page1+page2) = 最大2ページ = 最大4作品
	const selected = projects.find((project) => project.slug === openSlug);

	const activeChapterId = useStore($activeChapterId);
	const innerIndex = useStore($innerIndex);
	const rowRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setChapterPageCount('portfolio', pageGroups.length);
	}, [pageGroups.length]);

	useEffect(() => {
		document.body.dataset.modalOpen = selected ? 'true' : 'false';
		return () => {
			delete document.body.dataset.modalOpen;
		};
	}, [selected]);

	const clampedInnerIndex = activeChapterId === 'portfolio' ? Math.min(innerIndex, pageGroups.length - 1) : 0;
	const spreadIndex = Math.min(Math.floor(clampedInnerIndex / 2), spreads.length - 1);
	const pageOffset = clampedInnerIndex % 2;

	useEffect(() => {
		const row = rowRef.current;
		if (!row) return;
		const applyTransform = () => {
			const pageWidth = row.clientWidth;
			row.style.transform = `translateX(-${spreadIndex * pageWidth}px)`;
		};
		applyTransform();
		window.addEventListener('resize', applyTransform);
		return () => window.removeEventListener('resize', applyTransform);
	}, [spreadIndex]);

	return (
		<section
			id="portfolio"
			className="chapter-slide relative flex items-center justify-center overflow-hidden p-4 md:p-8"
			data-chapter="portfolio"
		>
			<div ref={rowRef} className="flex h-full w-full max-w-6xl transition-transform duration-400 ease-in-out">
				{spreads.map((spread, index) => (
					<div
						key={spread.map((page) => page.map((project) => project.slug).join('+')).join('-')}
						className="paper relative h-full w-full shrink-0 overflow-hidden rounded-lg shadow-2xl"
					>
						<div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-6 -translate-x-1/2 bg-gradient-to-r from-black/15 via-black/25 to-black/15 blur-sm md:block" />
						<div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-black/20 md:block" />
						<div
							className="spread-row h-full"
							style={{ '--page-offset': index === spreadIndex ? pageOffset : 0 } as React.CSSProperties}
						>
							{[0, 1].map((pageSlot) => {
								const page = spread[pageSlot] ?? [];
								return (
									<div
										key={pageSlot}
										className="spread-page flex h-full flex-col overflow-hidden p-8 md:px-16 md:py-8"
									>
										{index === 0 && pageSlot === 0 ? (
											<h2 className="font-heading text-3xl font-bold border-b-2 border-accent pb-1 mb-4">
												第二章 作品集
											</h2>
										) : (
											<h2
												className="font-heading text-3xl font-bold border-b-2 border-accent pb-1 mb-4 text-transparent select-none"
												aria-hidden="true"
											>
												&nbsp;
											</h2>
										)}
										<div className="flex flex-1 flex-col justify-center gap-4">
											{page.map((project) => (
												<button
													key={project.slug}
													type="button"
													onClick={() => setOpenSlug(project.slug)}
													className="mx-auto block w-full max-w-sm rounded-lg p-2 text-left shadow-md transition hover:shadow-lg hover:cursor-pointer"
												>
													<img
														src={project.imageSrc ?? noImageFallback.src}
														alt={project.title}
														className="rounded w-full aspect-5/2 object-cover mb-2"
													/>
													<h3 className="text-lg font-bold">{project.title}</h3>
												</button>
											))}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>

			{selected &&
				createPortal(
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 animate-in fade-in duration-200"
						onClick={(event) => {
							event.stopPropagation();
							setOpenSlug(null);
						}}
					>
						<div
							className="paper relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-xl p-8 text-left animate-in fade-in zoom-in-95 duration-300"
							onClick={(event) => event.stopPropagation()}
						>
							<button
								type="button"
								aria-label="閉じる"
								onClick={(event) => {
									event.stopPropagation();
									setOpenSlug(null);
								}}
								className="absolute top-4 right-4 h-10 w-10 cursor-pointer text-3xl leading-none"
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
