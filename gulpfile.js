const {
  src,
  dest,
  series,
  parallel
} = require("gulp");
const cleanCss = require("gulp-clean-css");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const del = require("del");

async function clean() {
  const deletedPaths = await del(["www/**", "www/**/**"]);

  if (deletedPaths.length === 0) {
    console.log("No files or directories deleted.");
  } else {
    console.log("Deleted files and directories:\n", deletedPaths.join("\n"));
  }
}

function css() {
  return src(["src/assets/css/normalise.css", "src/assets/css/base.css", "src/assets/css/*/**.css"])
    .pipe(cleanCss())
    .pipe(concat("site.min.css"))
    .pipe(dest("www/assets/css"));
}

function navsimCss() {
  return src("src/assets/css/navsim/**/**.css")
    .pipe(cleanCss())
    .pipe(concat("navsim.min.css"))
    .pipe(dest("www/assets/css"));
}

function js() {
  return src(["src/assets/scripts/navsim/ctor/*.js", "src/assets/scripts/navsim/debugInformation.js", "src/assets/scripts/navsim/navsim.js"])
    .pipe(terser())
    .pipe(concat("navsim.min.js"))
    .pipe(dest("www/assets/scripts"));
}

exports.clean = clean;
exports.default = series(clean, parallel(css, navsimCss, js));
