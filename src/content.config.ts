import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(["legal", "finance", "hospitality", "retail", "healthcare"]),
      categoryLabel: z.string(),
      summary: z.string().max(220),
      cover: image(),
      coverAlt: z.string(),
      demoUrl: z.string().url().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      publishedAt: z.date(),
    }),
});

const services = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
    schema: z.object({
      title: z.string(),
      summary: z.string().max(280),
      features: z.array(z.string()).min(1).max(8),
      ctaLabel: z.string().default("Select Plan"),
      ctaHref: z.string().default("/contact"),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      priceFrom: z.number().int().nonnegative().optional(),
      currency: z.string().length(3).optional(),
    }),
  });

export const collections = { portfolio, services };