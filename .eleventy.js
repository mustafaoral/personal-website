const htmlMinifier = require("html-minifier");
const filters = require("./src/_filters/filters.js");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const componentsDir = `./src/_includes/component`;
const photoCard = require(`${componentsDir}/photography/photoCard.js`);
const photoTags = require(`${componentsDir}/photography/photoTags.js`);
const photoPicture = require(`${componentsDir}/photography/photoPicture.js`);

function configurePassThroughCopy(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/images");

  if (process.env.ELEVENTY_ENV === "development") {
    eleventyConfig.addPassthroughCopy({ "src/assets/_dev/css": "assets/css" });
    eleventyConfig.addPassthroughCopy({ "src/assets/_dev/scripts": "assets/scripts" });
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

function configureShortcodes(eleventyConfig) {
  eleventyConfig.addShortcode("photoCard", photoCard);
  eleventyConfig.addShortcode("photoTags", photoTags);
  eleventyConfig.addShortcode("photoPicture", photoPicture);
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

  configureShortcodes(eleventyConfig);

  configureCollections(eleventyConfig);

  configurePlugins(eleventyConfig);

  eleventyConfig.setWatchThrottleWaitTime(100);
  eleventyConfig.setUseGitIgnore(false);

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
