const getBranchName = require('current-git-branch');

function getIsFirefoxBranch() {
  return getBranchName() === 'firefox';
}

module.exports = getIsFirefoxBranch;
