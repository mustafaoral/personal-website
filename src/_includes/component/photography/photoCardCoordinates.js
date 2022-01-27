const photoLabel = require("./photoLabel.js");

module.exports = function (photo) {
  if (!photo.location) {
    return "";
  }

  return `<a href="http://maps.google.com/maps?q=${photo.location.decimal}">${photoLabel({ data: photo.location.sexagesimal, isLink: true })}</a>`
};
