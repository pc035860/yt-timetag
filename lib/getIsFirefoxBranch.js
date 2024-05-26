const getBranchName = require('current-git-branch');

function getIsFirefoxBranch() {
  return /firefox/.test(getBranchName());
}

module.exports = getIsFirefoxBranch;
