const {
  src,
  dest,
  series,
  parallel,
  watch
} = require("gulp");
const cleanCss = require("gulp-clean-css");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const del = require("del");

async function clean() {
  const deletedPaths = await del(["src/assets/_dev", "www/**"]);

  if (deletedPaths.length === 0) {
    console.log("No files or directories deleted.");
  } else {
    console.log(`Deleted ${deletedPaths.length} files and directories`);
  }
}

const cssSources = ["src/assets/css/_vendor/*.css", "src/assets/css/base.css", "src/assets/css/*/**.css"];

function cssDev() {
  return src(cssSources)
    .pipe(concat("site.css"))
    .pipe(dest("src/assets/_dev/css"));
}

function cssProd() {
  return src(cssSources)
    .pipe(cleanCss())
    .pipe(concat("site.css"))
    .pipe(dest("www/assets/css"));
}

const navsimCssSources = "src/assets/css/navsim/**/**.css";

function navsimCssDev() {
  return src(navsimCssSources)
    .pipe(concat("navsim.css"))
    .pipe(dest("src/assets/_dev/css"));
}

function navsimCssProd() {
  return src(navsimCssSources)
    .pipe(cleanCss())
    .pipe(concat("navsim.css"))
    .pipe(dest("www/assets/css"));
}

const navsimJsSources = ["src/assets/scripts/navsim/ctor/*.js", "src/assets/scripts/navsim/debugInformation.js", "src/assets/scripts/navsim/navsim.js"];

function jsDev() {
  return src(navsimJsSources)
    .pipe(concat("navsim.js"))
    .pipe(dest("src/assets/_dev/scripts"));
}

function jsProd() {
  return src(navsimJsSources)
    .pipe(terser())
    .pipe(concat("navsim.js"))
    .pipe(dest("www/assets/scripts"));
}

function watchSources() {
  watch(cssSources, cssDev);
  watch(navsimCssSources, navsimCssDev);
  watch(navsimJsSources, jsDev);
}

exports.dev = series(clean, parallel(cssDev, navsimCssDev, jsDev));
exports.prod = series(clean, parallel(cssProd, navsimCssProd, jsProd));
exports.watch = watchSources;
