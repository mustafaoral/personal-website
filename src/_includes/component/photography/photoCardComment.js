module.exports = (photo) => {
  if (!photo.comments) {
    return "";
  }

  return photo.comments.map(x => `<p>${x}</p>`).join("");
};
