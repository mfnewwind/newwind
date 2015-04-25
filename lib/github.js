'use strict';
/*jslint node: true */

var GitHubApi = require("github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: false,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    pathPrefix: "", // for some GHEs; none for GitHub
    timeout: 5000,
    headers: {
        "user-agent": "Dr. NaminG" // GitHub is happy with a unique user agent
    }
});

/**
 * 組織一覧を取得する
 * @param userName ユーザー名
 */
function getOrgs(userName, cb) { 
  github.orgs.getFromUser({
    user: userName
  }, cb);
}

/**
 * 組織のレポジトリ一覧を取得する
 */
function getOrgRepos(org, cb) {
  github.repos.getFromOrg({
    org: org
  }, cb);
}

/**
 * ユーザーのレポジトリ一覧を取得する
 */
function getUserRepos(user, cb) {
  github.repos.getFromUser({
      user: user
  }, cb);
}

function getRepo(owner, repo, cb) {
  github.repos.get({
    user: owner,
    repo: repo
  }, cb);
}

function getBranch(owner, repo, branch, cb) {
  github.repos.getBranch({
    user: owner,
    repo: repo,
    branch: branch,
  }, cb);
}

/**
 * @param owner  所有者 (例: mfnewwind)
 * @param repo   レポジトリ名 (例: newwind)
 * @param cb     コールバック関数 (レポジトリのファイル一覧)
 */
function getRepoTree(owner, repoName, cb) {
  getRepo(owner, repoName, function (err, repo) {
    var defaultBranch = repo.default_branch;
  
    getBranch(owner, repoName, defaultBranch, function (err, branch) {
      if (err) { return cb(err); }

      var sha = branch.commit.sha;
      github.gitdata.getTree({
        user: owner,
        repo: repoName,
        sha: sha,
        recursive: true
      }, cb);
    });
  });
}


module.exports = {
  getOrgs: getOrgs,
  getUserRepos: getUserRepos,
  getOrgRepos: getOrgRepos,
  getRepoTree: getRepoTree
};