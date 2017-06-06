'use strict';
const fs=require('fs');
function getGitOrigin() {
    let gitOrigin = '';
    try {
        let gitConfig = fs.readFileSync('./.git/config', 'utf-8'), m = gitConfig.match(/\[remote\s+"origin"]\s+url\s+=\s+(\S+)\s+/i);
        if (m) {
            gitOrigin = m[1];
        }
    } finally {
        return gitOrigin;
    }
}
function getHomeUrl(repo) {
    let url = '';
    try {
        let m = repo.match(/^git@(\S+)\.git$/i);
        if (m) {
            url = m[1].split(':').join('/');
        }
    } finally {
        return url;
    }
}
module.exports={
    getGitOrigin:getGitOrigin,
    getHomeUrl:getHomeUrl
}