module.exports = ({ data, prefix = "", suffix = "", isLink = false }) => {
  if (data) {
    let cssClass = ["photoCard__label"];

    if (isLink) {
      cssClass.push("photoCard__label_link");
    }

    return `<span class="${cssClass.join(" ")}">${prefix}${data}${suffix}</span>`;
  }

  return "";
};
