import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/blog" }),
  schema: z.object({
    title: z.string(),
    snippet: z.string(),
    pubDate: z.coerce.date(),
    imageName: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { blog };
