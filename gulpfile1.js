import sass from 'sass'
import gulpSass from 'gulp-sass'
import concat from 'gulp-concat'
import gulp from 'gulp';
//import watch from 'gulp-watch';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
//import cssmin from 'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import rigger from 'gulp-rigger';
let preprocessor = 'sass';
//import src from 'gulp';
//import dest from 'gulp';
//import parallel from 'gulp';
//import series from 'gulp';
//import watch from 'gulp';
//import browserSync from 'browser-sync'
import less from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css';
import imageComp from 'compress-images';
import clean from 'gulp-clean';

// Определяем логику работы Browsersync
function browserSync() {
    browserSync.create().init({ // Инициализация Browsersync
        server: { baseDir: 'platform/' }, // Указываем папку сервера
        notify: false, // Отключаем уведомления
        online: true // Режим работы: true или false
    })
}

function scripts() {
    return gulp.src([ // Берём файлы из источников
        'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
        './js/scripts.js',
        './js/swiper.min.js'// Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
    ])
        .pipe(concat('./build/js/scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'))
        .pipe(browserSync.stream())
}

function styles() {
    return gulp.src('./styles/**/*.scss')
        .pipe(eval(preprocessor)())
        .pipe(concat('styles.css'))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
        .pipe(cleancss( { level: { 1: { specialComments: 0 } } } ))
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.stream())
}

async function images() {
    imageComp(
        "./src/**/*",
        "./build/images/", // Выгружаем оптимизированные изображения в папку назначения
        { compress_force: false, statistic: true, autoupdate: true }, false, // Настраиваем основные параметры
        { jpg: { engine: "mozjpeg", command: ["-quality", "75"] } }, // Сжимаем и оптимизируем изображеня
        { png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        function (err, completed) { // Обновляем страницу по завершению
            if (completed === true) {
                browserSync.reload()
            }
        }
    )
}

function cleanImg() {
    return gulp.src('./build/images/', {allowEmpty: true}).pipe(clean()) // Удаляем всё содержимое папки "app/images/dest/"
}

function buildCopy() {
    return gulp.src([ // Выбираем нужные файлы
        './css/**/*.css',
        './js/**/*.min.js',
        './images/**/*',
        './**/*.html',
    ], { base: 'platform' }) // Параметр "base" сохраняет структуру проекта при копировании
        .pipe(gulp.dest('dist')) // Выгружаем в папку с финальной сборкой
}

function cleanDist() {
    return gulp.src('dist', {allowEmpty: true}).pipe(clean()) // Удаляем всё содержимое папки "dist/"
}

function startWatch() {

    // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
    gulp.watch(['./**/*.js', '!./**/*.min.js'], scripts);

    // Мониторим файлы препроцессора на изменения
    gulp.watch('./styles/**/*.scss', styles);

    // Мониторим файлы HTML на изменения
    gulp.watch('./**/*.html').on('change', browserSync.reload);

    // Мониторим папку-источник изображений и выполняем images(), если есть изменения
    gulp.watch('./src/**/*', images);

}

// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browserSync = browserSync;

// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;

// Экспортируем функцию styles() в таск styles
exports.styles = styles;

// Экспорт функции images() в таск images
exports.images = images;

// Экспортируем функцию cleanimg() как таск cleanimg
exports.cleanImg = cleanImg;

// Создаём новый таск "build", который последовательно выполняет нужные операции
exports.build = gulp.series(cleanDist, styles, scripts, images, buildCopy);

// Экспортируем дефолтный таск с нужным набором функций
exports.default = gulp.parallel(styles, scripts, browserSync, startWatch);

/*let compiler = gulpSass(sass)

function compileCss() {
    return gulp.src('./styles/!**!/!*.scss')
        .pipe(compiler())
        .pipe(gulpConcat('styles.css'))
        .pipe(gulp.dest('./css/'))
}
gulp.task('default', function () {
    gulp.watch('.//!**!/!*.scss', compileCss)
    return compileCss();
})*/
