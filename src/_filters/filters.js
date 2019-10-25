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

module.exports = {
  toIsoDate: function (x) {
    return parseDate(x).toFormat("yyyy-MM-dd");
  }
}
