export default function(eleventyConfig) {

		eleventyConfig.addFilter("readableDate", (dateObj, lang) => {
		const locale = "en-GB"
		return dateObj.toLocaleDateString(locale, {year: "numeric", month: "long", day: "numeric"})
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj, lang) => {
		return dateObj.toLocaleDateString("en-GB")
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
	});

	// Authors
	eleventyConfig.addFilter('authorFilter', function(collection, author) {
	if (!author) {return collection}
		  const filtered = collection.filter(item => item.data.author == author)
		  return filtered;
	  });

	 // Categories
	 eleventyConfig.addFilter('categoryFilter', function(collection, category) {
		if (!category) return collection;
		  const filtered = collection.filter(item => item.data.categories == category)
		  return filtered;
	  });

	// add excerpt
	// use with <p>{{ post.templateContent | excerpt }}</p>
	eleventyConfig.addFilter("excerpt", (post) => {
		var content = post.replace(/(<([^>]+)>)|#/gi, "");
		content = content.replace(/&quot;/gi, "'");
		return content.substr(0, content.lastIndexOf(" ", 250)) + "...";
	  });


};
