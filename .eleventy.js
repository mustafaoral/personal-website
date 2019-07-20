const htmlMinifier = require("html-minifier");

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

module.exports = function (eleventyConfig) {
  configurePassThroughCopy(eleventyConfig);

  configureTransform(eleventyConfig);

  return {
    dir: {
      input: "src",
      output: "www",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk"
  }
};
