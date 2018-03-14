const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const del = require('del')
const runSequence = require('run-sequence')
const inquirer = require('inquirer')
const generatePage = require('@dp/generate-weapp-page')
const strip = require('gulp-strip-comments')

// load all gulp plugins
const plugins = gulpLoadPlugins()
const env = process.env.NODE_ENV || 'development'
const isProduction = () => env === 'production'

// utils functions
function generateFile (options) {
  const files = generatePage({
    root: path.resolve(__dirname, './src/'),
    name: options.pageName,
    less: options.styleType === 'less',
    scss: options.styleType === 'scss',
    css: options.styleType === 'css',
    json: options.needConfig
  })
  files.forEach && files.forEach(file => plugins.util.log('[generate]', file))
  return files
}

/**
 * Clean distribution directory
 */
gulp.task('clean', function() {
  return del(['dist/*','build/static/images/*'])
})

/**
 * Lint source code
 */
gulp.task('lint', () => {
  return gulp.src(['**/*.js','!node_modules/','!dist/','!build/'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format('node_modules/eslint-friendly-formatter'))
    .pipe(plugins.eslint.failAfterError())
})

gulp.task('compile:config', ()=>{
  //  配置中的VERSION,DEBUG字段读取系统配置
  var replace = require('gulp-replace')
  var version = require('./package.json').version
  var debug = require('./src/app.json').debug

  return gulp.src('./src/config/index.js')
  .pipe(replace(/VERSION\:(.*),/,`VERSION: '${version}',`))
  .pipe(replace(/DEBUG\:(.*),/, `DEBUG: ${debug},`))
  .pipe(gulp.dest('src/config/'))
})

/**
 * Compile js source to distribution directory
 */
gulp.task('compile:js', () => {
  return gulp.src(['src/**/*.js'])
    // .pipe(plugins.babel({
    //   presets: ["es2015"],
    //   plugins: ['transform-runtime']
    // }))
    // .pipe(plugins.babel())
    // .pipe(plugins.if(isProduction, plugins.uglify()))
    .pipe(gulp.dest('dist/'))
})

/**
 * Compile html source to distribution directory
 */
gulp.task('compile:html', () => {
  return gulp.src(['src/**/*.html'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.if(isProduction, plugins.htmlmin({
      collapseWhitespace: true,
      // collapseBooleanAttributes: true,
      // removeAttributeQuotes: true,
      keepClosingSlash: true, // html
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(plugins.rename({ extname: '.wxml' }))
    // .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
})

/**
 * Compile less source to distribution directory
 */
gulp.task('compile:less', () => {
  var postcss      = require('gulp-postcss');
  var autoprefixer = require('autoprefixer');

  return gulp.src(['src/**/*.less','!src/components/**/**','!src/stylesheets/**/**'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    // .pipe(postcss([ autoprefixer() ]))
    // .pipe(postcss(processors))
    .pipe(plugins.rename({ extname: '.wxss' }))
    // .pipe(plugins.sourcemaps.write('.'))
    .on('error', console.log)
    .pipe(gulp.dest('dist/'))
})

/**
 * Compile json source to distribution directory
 */
gulp.task('compile:json', () => {
  return gulp.src(['src/**/*.json'])
    .pipe(plugins.sourcemaps.init())
    .pipe(strip())
    .pipe(plugins.if(isProduction, plugins.jsonminify()))
    .pipe(gulp.dest('dist'))
})

/**
 * Compile img source to distribution directory
 */
gulp.task('compile:img', () => {
  return gulp.src(['src/images/*.{jpg,jpeg,png,gif}'])
    .pipe(gulp.dest('build/static/images'))
})


/**
 * Compile searchWidget source to distribution directory
 */
gulp.task('searchWidget', () => {
  return gulp.src(['src/searchWidget/**/*.*'])
    .pipe(gulp.dest('dist/searchWidget'))
})

/**
 * Compile source to distribution directory
 */
gulp.task('compile', ['clean'], next => {
  runSequence([
    'compile:html',
    'compile:less',
    'compile:json',
    'compile:config',
    'compile:js',
    'compile:img'
  ], next)
})

/**
 * Copy extras to distribution directory
 */
gulp.task('extras', [], () => {
  return gulp.src([
    'movie*/**/*',
    'src/**/*.*',
    '!src/**/*.md',
    '!src/**/*.js',
    '!src/**/*.html',
    '!src/**/*.less',
    '!src/**/*.json',
    '!src/**/*.{jpe?g,png,gif}'
  ])
  .pipe(gulp.dest('dist'))
})

/**
 * Build
 */
gulp.task('build', ['clean'], next => runSequence(['extras','compile'], 'searchWidget', next))

/**
 * Watch source change
 */
gulp.task('watch', ['build'], () => {
  gulp.watch('movie*/**/*', ['extras'])
  gulp.watch('src/**/*.js', ['compile:js'])
  gulp.watch('src/**/*.html', ['compile:html'])
  gulp.watch('src/**/*.less', ['compile:less'])
  gulp.watch('src/**/*.json', ['compile:json'])
  gulp.watch('src/**/*.{jpe?g,png,gif}', ['compile:img'])
})

/**
 * Generate new page
 */
gulp.task('generate', next => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'pageName',
      message: 'Input the page name',
      default: 'index'
    },
    {
      type: 'confirm',
      name: 'needConfig',
      message: 'Do you need a configuration file',
      default: false
    }
  ])
  .then(options => {
    const res = generateFile(options)
  })
  .catch(err => {
    throw new plugins.util.PluginError('generate', err)
  })
})

/**
 * Default task
 */
gulp.task('ci', [], next => runSequence(['clean','compile:img'], next))

gulp.task('default', ['ci'])
