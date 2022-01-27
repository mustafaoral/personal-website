module.exports = function (photo, isFullSize) {
  const metadataAccessor = isFullSize ? "metadataFull" : "metadataThumbnail";

  return `
  <picture class="photoCard__image">
    <source srcset="${photo[metadataAccessor].webp[0].url}" type="image/webp">
    <source srcset="${photo[metadataAccessor].jpeg[0].url}" type="image/jpeg">
    <img src="${photo[metadataAccessor].jpeg[0].url}" width="${photo[metadataAccessor].jpeg[0].width}" height="${photo[metadataAccessor].jpeg[0].height}" alt="Tags: ${photo.tags.join(", ")}">
  </picture>`;
}
