const {
  DateTime
} = require("luxon");

function parseDate(x) {
  if (x instanceof Date) {
    return DateTime.fromJSDate(x);
  }

  return DateTime.fromISO(x, {
    zone: "utc"
  });
}

const photographyTagToUrlCompatibleSegmentMap = {
  "black & white": "blackandwhite"
};

module.exports = {
  toIsoDate: function (x) {
    return parseDate(x).toFormat("yyyy-MM-dd");
  },
  photographyTagToUrlCompatibleSegment: function (x) {
    if (Object.keys(photographyTagToUrlCompatibleSegmentMap).indexOf(x) === -1) {
      return x;
    }

    return photographyTagToUrlCompatibleSegmentMap[x];
  }
}
