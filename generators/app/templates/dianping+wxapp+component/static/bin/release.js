const shelljs = require('shelljs')
const version = require('../package.json').version

let branchVersion = shelljs.exec('git branch | grep "*" | cut -d " " -f2')
if (branchVersion.indexOf(version) === -1) {
    throw new Error(`当前分支版本${branchVersion}和当前package.json版本${version}不匹配`)
} else {
    console.log('版本校验通过')
}
