import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			image: image().optional(),
			githubUrl: z.string().url(),
			renderUrl: z.string().url(),
			techStack: z.array(z.string()),
			order: z.number(),
		}),
});

export const collections = { projects };
