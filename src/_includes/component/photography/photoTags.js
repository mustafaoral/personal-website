const photoLabel = require("./photoLabel.js");
const filters = require("../../../_filters/filters.js");

module.exports = (tags) => {
  return tags.map(x => x).sort().map(x => `<a href="/photography/tag/${filters.photographyTagToUrlCompatibleSegment(x)}/">${photoLabel({ data: x, mode: "link" })}</a>`).join("");
};
