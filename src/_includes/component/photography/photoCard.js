const photoCardComment = require("./photoCardComment.js");
const photoLabel = require("./photoLabel.js");
const photoTags = require("./photoTags.js");
const photoPicture = require("./photoPicture.js");
const photoCardCoordinates = require("./photoCardCoordinates.js");

module.exports = function (photo, wrapWithLink) {
  let pictureElement = photoPicture(photo, true);

  if (wrapWithLink) {
    pictureElement = `<a href ="/photography/photo/${photo.hash}">${pictureElement}</a>`
  }

  const equipmentDetails = Object.keys(photo.equipment).map(x => {
    return photoLabel({ data: photo.equipment[x] })
  }).join("");

  const captureDetails = photo.captureDetails.map(x => {
    return `<div>${photoLabel({ data: x.focalLength, suffix: "mm" })}${photoLabel({ data: x.aperture, prefix: "f/" })}${photoLabel({ data: x.exposure, suffix: "s" })}${photoLabel({ data: x.iso, prefix: "ISO " })}</div>`;
  }).join("");

  return `
    <div class="photoCard">
      ${pictureElement}

      <div class="photoCard__details">
        ${photoCardComment(photo)}

        <p>${equipmentDetails}</p>
        <p>${captureDetails}</p>

        <p>${photoCardCoordinates(photo)}</p>
        ${photoTags(photo.tags)}
      </div>
    </div>
  `;
};
