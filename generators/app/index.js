const yeoman = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const extend = require('deep-extend');
const utils = require('./utils/misc');
const CONFIG = require('./templates/config');
const boilerplatesMap = CONFIG.boilerplatesMap;

module.exports = yeoman.Base.extend({
    info: function() {
        this.log(chalk.green(
            'I am going to build your app!'
        ));
    },
    initializing: function () {
        this.props = {};
    },
    prompting: function () {
        var done = this.async();
                let allBoilerplates=_.keys(boilerplatesMap);

        var prompts = [ 
                {
                    name: 'boilerplate',
                    type: 'list',
                    choices: allBoilerplates,
                    default: allBoilerplates[0],
                    message: 'boilerplate'
                }, {
                    name: 'name',
                    message: 'Your project name',
                    default: path.basename(process.cwd())// Default to current folder name
                }, {
                    name: 'version',
                    default: '0.0.1',
                    message: 'version'
                },
                {
                    name: 'description',
                    default: '项目描述',
                    message: 'description'
                },
                {
                    name: 'repo',
                    default: utils.getGitOrigin(),
                    message: 'git repository'
                },
                {
                    name: 'keywords',
                    default: '关键词',
                    message: 'keywords',
                    filter: function (words) {
                        return words.split(/\s*,\s*/g);
                    }
                },
                {
                    name: 'author',
                    default: this.user.git.name() || '张三',
                    message: 'author'
                },
                {
                    name: 'email',
                    default: this.user.git.email(),
                    message: 'E-Mail'
                }
        ];

        this.prompt(prompts, function (props) {
            this.props = props;
            // To access props later use this.props.someAnswer;
            done();
        }.bind(this));
    },
    /*
     * 生成 LICENSE
     *
     * */
    default: function () {
        this.composeWith('license', {
            options: {
                name: this.props.author,
                email: this.props.email,
                website: ''
            }
        }, {
            local: require.resolve('generator-license/app')
        });
    },
    writing:{
        "init":function () {
            this.currentDir = boilerplatesMap[this.props.boilerplate] || _.keys(boilerplatesMap)[0];
        },
        /*
         * 生成 package.json
         *
         * */
        "package_json": function () {
            var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
            var pkg_json={
                "webpack2+vue2+router2": {
                    devDependencies:{
                        "autoprefixer": "^6.7.2",
                        "babel-core": "^6.22.1",
                        "babel-loader": "^6.2.10",
                        "babel-plugin-transform-runtime": "^6.22.0",
                        "babel-preset-env": "^1.3.2",
                        "babel-preset-stage-2": "^6.22.0",
                        "babel-register": "^6.22.0",
                        "chalk": "^1.1.3",
                        "compression-webpack-plugin": "^0.4.0",
                        "connect-history-api-fallback": "^1.3.0",
                        "copy-webpack-plugin": "^4.0.1",
                        "css-loader": "^0.28.0",
                        "eventsource-polyfill": "^0.9.6",
                        "express": "^4.14.1",
                        "extract-text-webpack-plugin": "^2.0.0",
                        "fetch-jsonp": "^1.0.6",
                        "file-loader": "^0.11.1",
                        "friendly-errors-webpack-plugin": "^1.1.3",
                        "html-webpack-plugin": "^2.28.0",
                        "http-proxy-middleware": "^0.17.3",
                        "isomorphic-fetch": "^2.2.1",
                        "less": "^2.7.2",
                        "less-loader": "^4.0.3",
                        "opn": "^4.0.2",
                        "optimize-css-assets-webpack-plugin": "^1.3.0",
                        "ora": "^1.2.0",
                        "rimraf": "^2.6.0",
                        "semver": "^5.3.0",
                        "shelljs": "^0.7.6",
                        "url-loader": "^0.5.8",
                        "vue-datepicker": "^1.3.0",
                        "vue-datepicker-simple": "^1.5.1",
                        "vue-loader": "^11.3.4",
                        "vue-style-loader": "^2.0.5",
                        "vue-template-compiler": "^2.2.6",
                        "vuex": "^2.3.1",
                        "webpack": "^2.3.3",
                        "webpack-bundle-analyzer": "^2.2.1",
                        "webpack-dev-middleware": "^1.10.0",
                        "webpack-hot-middleware": "^2.18.0",
                        "webpack-merge": "^4.1.0"
                    },
                    dependencies:{
                        "@dp/base-op-url": "^1.1.5",
                        "@dp/mbase-style": "^1.1.21",
                        "@dp/url-rewrite": "^0.4.0",
                        "@dp/util-login": "^1.0.3",
                        "@dp/util-m-share": "^4.0.0",
                        "@dp/util-m-ua": "^2.0.0",
                        "@gfe/app-common-toast": "^0.1.4",
                        "@dp/geo":"^1.0.0",
                		 "gulp": "^3.9.1",
                        "gulp-htmlmin": "^3.0.0",
                        "vue": "^2.2.6",
                        "vue-router": "^2.3.1"
                    },
                    scripts:{
                        "dev": "node build/dev-server.js",
                        "start": "node build/dev-server.js",
                        "build": "node build/build.js"
                    }
                },
                "dianping+wxapp+component":{
                    devDependencies: {
                        "@dp/generate-weapp-page": "^0.1.3",
                        "autoprefixer": "^6.5.4",
                        "babel-plugin-transform-runtime": "^6.15.0",
                        "babel-preset-es2015": "^6.16.0",
                        "cross-env": "^3.1.2",
                        "cz-conventional-changelog": "^1.2.0",
                        "del": "^2.2.2",
                        "eslint": "^3.7.1",
                        "eslint-config-standard": "^6.2.0",
                        "eslint-config-yayajing": "^1.0.0",
                        "eslint-friendly-formatter": "^2.0.6",
                        "eslint-plugin-hybrid": "0.0.1",
                        "eslint-plugin-json": "^1.2.0",
                        "eslint-plugin-promise": "^3.0.0",
                        "eslint-plugin-standard": "^2.0.1",
                        "gulp": "^3.9.1",
                        "gulp-babel": "^6.1.2",
                        "gulp-eslint": "^3.0.1",
                        "gulp-htmlmin": "^3.0.0",
                        "gulp-if": "^2.0.1",
                        "gulp-jsonminify": "^1.0.0",
                        "gulp-less": "^3.1.0",
                        "gulp-load-plugins": "^1.3.0",
                        "gulp-postcss": "^6.2.0",
                        "gulp-rename": "^1.2.2",
                        "gulp-replace": "^0.5.4",
                        "gulp-sourcemaps": "^2.0.1",
                        "gulp-strip-comments": "^2.4.3",
                        "gulp-util": "^3.0.7",
                        "inquirer": "^1.2.2",
                        "pre-commit": "^1.2.2",
                        "run-sequence": "^1.2.2",
                        "shelljs": "^0.8.1",
                        "standard-version": "^4.0.0"
                    },
                    dependencies: {
                        "@analytics/wechat-sdk": "^1.2.1",
                        "@dp/adu_track": "^1.0.7",
                        "@hfe/mp-owl": "0.0.4",
                        "@mtfe/wx-rc-finger": "^1.0.6",
                        "@mtfe/wxapp-rohr": "^1.0.3",
                        "widgetdom-template-compiler": "^0.1.39"
                     },
                    scripts: {
                        "lint": "node ./node_modules/.bin/eslint src",
                        "watch": "gulp watch",
                        "build": "gulp build",
                        "page": "gulp generate",
                        "release": "node bin/release.js && npm run build"
                    }
                },
                "webpack2+vue2":{
                    devDependencies:{
                        "autoprefixer": "^6.7.2",
                        "babel-core": "^6.22.1",
                        "babel-loader": "^6.2.10",
                        "babel-plugin-transform-runtime": "^6.22.0",
                        "babel-preset-env": "^1.3.2",
                        "babel-preset-stage-2": "^6.22.0",
                        "babel-register": "^6.22.0",
                        "chalk": "^1.1.3",
                        "compression-webpack-plugin": "^0.4.0",
                        "connect-history-api-fallback": "^1.3.0",
                        "copy-webpack-plugin": "^4.0.1",
                        "css-loader": "^0.28.0",
                        "eventsource-polyfill": "^0.9.6",
                        "express": "^4.14.1",
                        "extract-text-webpack-plugin": "^2.0.0",
                        "fetch-jsonp": "^1.0.6",
                        "file-loader": "^0.11.1",
                        "friendly-errors-webpack-plugin": "^1.1.3",
                        "html-webpack-plugin": "^2.28.0",
                        "http-proxy-middleware": "^0.17.3",
                        "isomorphic-fetch": "^2.2.1",
                        "less": "^2.7.2",
                        "less-loader": "^4.0.3",
                        "opn": "^4.0.2",
                        "optimize-css-assets-webpack-plugin": "^1.3.0",
                        "ora": "^1.2.0",
                        "rimraf": "^2.6.0",
                        "semver": "^5.3.0",
                        "shelljs": "^0.7.6",
                        "url-loader": "^0.5.8",
                        "vue-loader": "^11.3.4",
                        "vue-style-loader": "^2.0.5",
                        "vue-template-compiler": "^2.2.6",
                        "webpack": "^2.3.3",
                        "webpack-bundle-analyzer": "^2.2.1",
                        "webpack-dev-middleware": "^1.10.0",
                        "webpack-hot-middleware": "^2.18.0",
                        "webpack-merge": "^4.1.0"
                    },
                    dependencies:{
                        "@dp/base-op-url": "^1.1.5",
                        "@dp/mbase-style": "^1.1.21",
                        "@dp/url-rewrite": "^0.4.0",
                        "@dp/util-login": "^1.0.3",
                        "@dp/util-m-share": "^4.0.0",
                        "@dp/util-m-ua": "^2.0.0",
                        "@gfe/app-common-toast": "^0.1.4",
                        "@dp/geo":"^1.0.0",
                		"gulp": "^3.9.1",
                        "gulp-htmlmin": "^3.0.0",
                        "vue": "^2.2.6"
                    },
                    scripts:{
                        "dev": "node build/dev-server.js",
                        "start": "node build/dev-server.js",
                        "build": "node build/build.js"
                    }
                }
            }[this.props.boilerplate]||{};

            var pkg = extend({
                name: _.kebabCase(this.props.name),
                version: _.kebabCase(this.props.version),
                description: this.props.description,
                repository: {
                    type: 'git',
                    url: this.props.repo
                },
                author: {
                    name: this.props.author, 
                    email: this.props.email
                },
                keywords: [],
                "dependencies": pkg_json.dependencies||{},
                "devDependencies": pkg_json.devDependencies||{},
                "scripts":pkg_json.scripts||{},
                "bugs": {
                    "url": "http://" + utils.getHomeUrl(this.props.repo) + "/issues"
                },
                "homepage": "http://" + utils.getHomeUrl(this.props.repo)
            }, currentPkg);
            // Combine the keywords
            if (this.props.keywords) {
                pkg.keywords = _.uniq(this.props.keywords.concat(pkg.keywords));
            }
            if (this.props.name){
                pkg.name = '@dp/' + this.props.name;
            }
            if (this.props.version){
                pkg.version = this.props.version;
            }
               pkg.author = {};
            if (this.props.author){
                pkg.author.name = this.props.author;
            }
            if (this.props.email){
                pkg.author.email= this.props.email;
            }
            // Let's extend package.json so we're not overwriting user previous fields
            this.fs.writeJSON(this.destinationPath('package.json'), pkg);
        },
        /*
         * 生成 README.md
         *
         * */
        "directories": function () {
            this.fs.copyTpl(this.templatePath('./' + this.currentDir + '/static') + "/gitignore", this.destinationPath('./.gitignore'));
            this.fs.copyTpl(this.templatePath('./' + this.currentDir + '/static') + "/babelrc", this.destinationPath('./.babelrc'));
            this.fs.copyTpl(this.templatePath('./' + this.currentDir + '/static') + "/**/*.*", this.destinationPath('./'));
            // this.fs.copyTpl(this.templatePath('./' + this.currentDir + '/tpl') + "/**/*.*", this.destinationPath('./'), {AppName: this.pkg.name});
        }
    },
    install:function (){      //安装依赖
         let opt = {
            cwd: this.destinationPath('./')
        };
        switch (this.props.boilerplate) {
            case 'webpack2+vue2':
                this.spawnCommandSync('yarn', ['install'],opt);
                // this.spawnCommandSync('webpack',[],opt);
                this.spawnCommandSync('npm',['start'],opt);
                break;
            case 'webpack2+vue2+router2':
                this.spawnCommandSync('yarn', ['install'],opt);
                // this.spawnCommandSync('webpack',[],opt);
                this.spawnCommandSync('npm',['start'],opt);
                break;
            case 'dianping+wxapp+component':
                // this.spawnCommandSync('yarn', ['install'],opt);
                // this.spawnCommandSync('webpack',[],opt);
                this.spawnCommandSync('npm',['install'],opt);    
            default:
                break;
        }
    }
});
