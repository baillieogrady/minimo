// see video explanation: https://youtu.be/ubHwScDfRQA

const { src, dest, watch, series } = require("gulp");

const prefix = require("gulp-autoprefixer");
const minify = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const terser = require("gulp-terser");
const browserSync = require("browser-sync").create();
// const imagemin = require('gulp-imagemin');

//compile, prefix, and min css
function css() {
    return (
        src("src/app.css") // change to your source directory
            .pipe(
                postcss([
                    require('tailwindcss/nesting'),
                    tailwindcss("./tailwind.config.js"),
                    require("autoprefixer")])
            )
            .pipe(prefix("last 2 versions"))
            .pipe(minify())
            .pipe(dest("dist"))
    ); // change to your final/public directory
}

// //optimize and move images
// function img() {
//     return src('src/images/*.{jpg,png}') // change to your source directory
//         .pipe(imagemin([
//             imagemin.mozjpeg({ quality: 80, progressive: true }),
//             imagemin.optipng({ optimizationLevel: 2 }),
//         ]))
//         .pipe(dest('dist/images')) // change to your final/public directory
// };

// minify js
function js() {
    return src("src/app.js") // change to your source directory
        .pipe(terser())
        .pipe(dest("dist")); // change to your final/public directory
}

// browsersync
function browsersyncServe(cb) {
    browserSync.init({
        proxy: "http://baillie-ogrady.local/",
    });
    cb();
}

function browsersyncReload(cb) {
    browserSync.reload();
    cb();
}

//watchtask
function watchTask() {
    watch(
        "src/**/*.css",
        series(css, js, browsersyncReload)
    );
    watch(
        "src/**/*.js",
        series(css, js, browsersyncReload)
    );

    // watch('src/images/*', img);
}

// Default Gulp task
exports.default = series(
    css,
    js,
    // img,
    browsersyncServe,
    watchTask
);

// Build command
exports.build = series(css, js);