import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from 'markdown-it-footnote';
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginBundle from "@11ty/eleventy-plugin-bundle";
import pluginNavigation from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
/* import { eleventyImageTransformPlugin } from "@11ty/eleventy-img"; */
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import Image from "@11ty/eleventy-img";
import { execSync } from 'child_process';
import metadata from "./_data/metadata.js";

import path from "path";

import pluginFilters from "./_config/filters.js";

export default function (eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-okaidia.css",
	});

	// Run Eleventy when these files change: https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets
	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// App plugins
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// can ignore by adding eleventy:ignore to img attributes
		formats: ["webp", "auto"],
		widths: [400, 800, 1200, 2400, "auto"],
		outputDir: "./_site/img", // must match your output folder
    	urlPath: "/img/",         // public path on server
		htmlOptions: {
			imgAttributes: {
				loading: "lazy",
				decoding: "async",
				sizes: "auto, (width <= 620px) 100vw, 75vw",
			},
		},
	});

	// Shortcodes
	eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

	eleventyConfig.addShortcode("imageSet", async function(src, id) {
		src = path.join(path.dirname(this.page.inputPath), src);
		const metadata = await Image(src, {
			widths: [800, 1200, 2400, "auto"],
			formats: ["webp"],
			outputDir: "_site/img/",
			urlPath: "/img/",
		});

		const webp = metadata.webp;

		return `<style>
				#${id} { background-image: url('${webp[0].url}'); }
				@media (min-width: 800px) { #${id} { background-image: url('${webp[1].url}'); } }
				@media (min-width: 1200px) { #${id} { background-image: url('${webp[2].url}'); } }
				@media (min-width: 2400px) { #${id} { background-image: url('${webp[3].url}'); } }
    		</style>`

	});


		// Filters
	eleventyConfig.addPlugin(pluginFilters);

	// Amend md library
	eleventyConfig.amendLibrary("md", (mdLib) => {
		mdLib.set(
			{
			html: true,
			breaks: true,
			linkify: true
		})

		.use(markdownItFootnote) 		// add markdown footnotes
		.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter("slugify")
		})

		// amend library to change md images to figures
		.use(md => {
			md.renderer.rules.image = (tokens, idx) => {
			const token = tokens[idx];
			const src = token.attrGet('src');
			const alt = token.content || '';
			const caption = token.attrGet('title');

			// Collect attributes
			const attributes = token.attrs || [];
/* 			const hasEleventyWidths = attributes.some(([key]) => key === 'eleventy:widths');
			if (!hasEleventyWidths) {
				attributes.push(['eleventy:widths', '650,960,1400']);
			} */

			const attributesString = attributes.map(([key, value]) => `${key}="${value}"`).join(' ');
			const imgTag = `<img src="${src}" alt="${alt}" ${attributesString}>`;
			return caption ? `<figure>${imgTag}<figcaption>${caption}</figcaption></figure>` : imgTag;
			};
		})
	});
	
	// add search
	// if it crashes, do pagefind command after your Eleventy site build script has finished instead of in the after event.
	eleventyConfig.on('eleventy.after', () => {
		execSync(`npx pagefind --glob \"**/*.html\"`, { encoding: 'utf-8' })
	})
	
	//RSS plugin
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/feed.xml",
		collection: {
			name: "posts", // iterate over `collections.posts`
			limit: 10,     // 0 means no limit
		},
		metadata
	});

	// If your passthrough copy gets heavy and cumbersome, add this line
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid",
		],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content",          // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
		},

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		/* pathPrefix: "/adaptive-movement/", */
	};
};

