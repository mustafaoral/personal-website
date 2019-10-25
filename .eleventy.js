const htmlMinifier = require("html-minifier");
const filters = require("./src/_filters/filters.js");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

function configurePassThroughCopy(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/images");

  if (process.env.ELEVENTY_ENV === "development") {
    eleventyConfig.addPassthroughCopy("src/assets/css");
    eleventyConfig.addPassthroughCopy("src/assets/scripts");
  }
}

function configureTransform(eleventyConfig) {
  eleventyConfig.addTransform("htmlMinifier", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      return htmlMinifier.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: process.env.ELEVENTY_ENV !== "development",
        minifyJS: true
      });
    }
    return content;
  });
}

function configureFilters(eleventyConfig) {
  Object.keys(filters).forEach(x => {
    eleventyConfig.addFilter(x, filters[x])
  });
}

function configureCollections(eleventyConfig) {
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("src/posts/*.md").reverse();
  });
}

function configurePlugins(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: ["njk", "md"]
  });
}

module.exports = function (eleventyConfig) {
  configurePassThroughCopy(eleventyConfig);

  configureTransform(eleventyConfig);

  configureFilters(eleventyConfig);

  configureCollections(eleventyConfig);

  configurePlugins(eleventyConfig);

  return {
    dir: {
      input: "src",
      output: "www",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk"
  }
};
