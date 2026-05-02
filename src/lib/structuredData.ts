import type { CollectionEntry } from "astro:content";

type JsonLd = Record<string, unknown>;

export type BreadcrumbItem = {
	name: string;
	path: string;
};

export type FaqItem = {
	question: string;
	answer: string;
};

export const resolveSiteUrl = (site: URL, path = "/") =>
	new URL(path, site).toString();

export const organizationSchema = (site: URL): JsonLd => ({
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "LUFEP",
	url: resolveSiteUrl(site),
	logo: resolveSiteUrl(site, "/favicon.svg"),
	description:
		"Servicios de diseño y desarrollo web premium para profesionales que buscan sitios web rápidos, confiables y orientados a conversión.",
});

export const breadcrumbListSchema = (
	site: URL,
	items: BreadcrumbItem[],
): JsonLd => ({
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: items.map((item, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: item.name,
		item: resolveSiteUrl(site, item.path),
	})),
});

export const servicesPageSchema = (
	site: URL,
	services: CollectionEntry<"services">[],
): JsonLd => ({
	"@context": "https://schema.org",
	"@type": "Service",
	name: "Servicios de desarrollo web LUFEP",
	description:
		"Servicios de desarrollo web para crear presencia digital, experiencias interactivas y plataformas de crecimiento para negocios profesionales.",
	provider: {
		"@type": "Organization",
		name: "LUFEP",
		url: resolveSiteUrl(site),
	},
	serviceType: "Web design and development",
	hasOfferCatalog: {
		"@type": "OfferCatalog",
		name: "Planes de desarrollo web",
		itemListElement: services.map((service) => ({
			"@type": "Offer",
			name: service.data.title,
			description: service.data.summary,
			url: resolveSiteUrl(site, service.data.ctaHref),
			itemOffered: {
				"@type": "Service",
				name: service.data.title,
				description: service.data.summary,
			},
			...(service.data.priceFrom && service.data.currency
				? {
						priceSpecification: {
							"@type": "PriceSpecification",
							price: service.data.priceFrom,
							priceCurrency: service.data.currency,
						},
					}
				: {}),
		})),
	},
});

export const faqPageSchema = (faqs: FaqItem[]): JsonLd => ({
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: faqs.map((faq) => ({
		"@type": "Question",
		name: faq.question,
		acceptedAnswer: {
			"@type": "Answer",
			text: faq.answer,
		},
	})),
});
