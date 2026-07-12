import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.union([
				z.string(),
				z.array(z.union([z.string(), z.object({ text: z.string(), url: z.string().url().optional() })])),
			]),
			image: image().optional(),
			githubUrl: z.string().url().optional(),
			renderUrl: z.string().url().optional(),
			techStack: z.array(z.string()),
			order: z.number(),
		}),
});

export const collections = { projects };
