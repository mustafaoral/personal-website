const fs = require("fs");
const path = require("path");

const pathToGitDirectory = path.join(__dirname, "..", "..", ".git");

function getFileContent(path) {
  return fs.readFileSync(path).toString().trim();
}

function getBuildConfig() {
  let branch, sha;

  if (process.env.ELEVENTY_ENV === "netlify") {
    // On netlify, there's no branch information in HEAD: it looks like the working copy is from a detached head. Retrieve branch from FETCH_HEAD, which looks like:
    // eeb9b6dcd8a0f053e590f59ed1bc53c46f144ef9       branch 'master' of ...
    const match = getFileContent(path.join(pathToGitDirectory, "FETCH_HEAD")).match(/^(?<sha>[a-z0-9]+)\s+branch\s'(?<branch>[a-z0-9-]+)'\s.+/m);

    sha = match.groups["sha"].trim();
    branch = match.groups["branch"].trim();
  } else {
    // During dev, HEAD should point to a branch most of the time. The content looks like:
    // ref: refs/heads/master
    const tokens = getFileContent(path.join(pathToGitDirectory, "HEAD")).split(":")[1].split("/").map(x => x.trim());

    branch = tokens[tokens.length - 1];
    sha = getFileContent(path.join(pathToGitDirectory, ...tokens));
  }

  return {
    branch: branch,
    shortSha: sha.substring(0, 7),
    bitbucketLink: `https://github.com/mustafaoral/personal-website/commit/${sha}`
  };
}

module.exports = function () {
  return getBuildConfig()
}
