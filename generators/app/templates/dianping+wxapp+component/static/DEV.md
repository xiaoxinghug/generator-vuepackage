# 如何参与开发

> 开发前请仔细阅读下面的所有信息, 请遵守开发规范

## 目录结构

* src: 开发目录
* dist: 构建目录
* movie: 电影单独目录（后续迁移到src中）
* bin: 脚本文件

## 相关命令使用

* npm run page: 生成一套新页面, 在src/pages/目录下, 并在app.json注册
* npm run build: 构建生成小程序最终代码
* npm run watch: 构建基础之上增加watch功能
* npm run lint: 检查代码风格，查找错误
* npm run release: 发布体验版并校验版本

## 代码规范

* 代码规范需要符合eslint的标准规则
* 基础组件, 包括但不仅限于定位、城市、账号信息(token、openId、uuid)、request请求管理等, 请统一使用平台提供的方案, 不满足可以提出需求
* 基础设施, 包括但不局限于数据上报、日志管理, 请统一使用平台提供的方案
* 可以使用ES6语法糖, 但不允许使用generator等需要runtime的功能, 我们对代码体积有严格规范

##  分支规范

* master分支对应最新线上代码，release分支对应各版本代码，trial分支对应各版本体验版代码，以上三类分支不允许直接push，代码冲突时不可以与trial分支进行代码合并
* 新建分支开发, 命名以feat_（新特性开发）, update_（特性更新）, bug_（特性修复）开发对应不同的开发需求
* 使用`git add`和`git cz`命令书写统一的commit msg. [为什么书写规范的commit消息](https://github.com/commitizen/cz-cli)
* 开发完成自测，体验版QA测试通过后, 通过PR申请合并到release_分支
