import { useState } from 'react';

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

export const Portfolio = ({ projects }: Props) => {
	const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug);
	const selected = projects.find((project) => project.slug === selectedSlug);

	return (
		<section
			id="portfolio"
			className="bg-texture bg-primary/10 bg-blend-multiply min-h-[50vh] flex flex-col items-center justify-center gap-6 px-4 py-12 text-center"
		>
			<h2 className="text-3xl font-bold text-primary border-b-2 border-primary pb-1 inline-block">Portfolio</h2>
			<div className="grid grid-cols-1 md:grid-cols-[200px_1fr] w-full max-w-4xl items-start gap-8">
				<div className="flex flex-row md:flex-col gap-2 justify-center flex-wrap">
					{projects.map((project) => (
						<button
							key={project.slug}
							onClick={() => setSelectedSlug(project.slug)}
							className={`px-4 py-2 md:w-48 rounded ${
								selectedSlug === project.slug ? 'bg-primary text-white' : 'bg-base text-letter'
							}`}
						>
							{project.title}
						</button>
					))}
				</div>
				<div className="text-left bg-base rounded-lg shadow-md p-6">
					{selected ? (
						<div className="space-y-4">
							{selected.imageSrc && (
								<img src={selected.imageSrc} alt={selected.title} className="rounded w-full" />
							)}
							{Array.isArray(selected.description) ? (
								<ul className="space-y-2 text-letter leading-relaxed">
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
														className="text-xs px-2 py-1 bg-primary text-white rounded hover:opacity-90 transition"
													>
														Link
													</a>
												)}
											</li>
										);
									})}
								</ul>
							) : (
								<p className="text-letter leading-relaxed">{selected.description}</p>
							)}
							<div className="flex flex-wrap gap-2">
								{selected.techStack.map((tech) => (
									<span key={tech} className="text-xs px-2 py-1 bg-secondary/40 rounded text-letter">
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
										className="px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition"
									>
										GitHub
									</a>
								)}
								{selected.renderUrl && (
									<a
										href={selected.renderUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition"
									>
										Link
									</a>
								)}
							</div>
						</div>
					) : (
						<p className="text-letter">プロジェクトを選択してください</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default Portfolio;
