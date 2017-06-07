vue技术栈脚手架:

webpack2+vue2 -- vue2 脚手架

webpack2+vue2+router2 -- vue2+router2 脚手架

使用脚手架生成项目:
npm install -g yarn

npm install -g yo

npm install -g generator-vue-webpack

cd /path/of/your/project //切到你的项目目录

yo 回车 选择 Vuewebpack 或者
yo generator-vue-webpack //在你的项目目录下执行

本地开发
执行npm run start命令，会开启一个本地服务器。

构建
执行npm run build命令，会在dist/static目录下，生成webpack打包后的.js和.css文件。
