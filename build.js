'use strict';
var argWatch = false;
process.argv.forEach(function (val, index, array) {
    if (val === 'watch')
        argWatch = true;
});
var Duo = require('duo'),
    sane = require('sane'),
    sass = require('duo-sass'),
    jsx = require('duo-jsx'),
    babel = require('duo-babel'),
    root = __dirname + '/app',
    duo = new Duo(root),
    mkdir = require('mkdirp').sync,
    path = require('path'),
    join = path.join,
    fs = require('fs'),
    build = join(__dirname, 'build'),
    outJs = path.join(build, 'entry.js'),
    outCss = path.join(build, 'entry.css'),
    touch = require('touch');


mkdir(build);

var watch = function(){
    var watcher = sane(root, {glob: ['**/*.js', '**/*.scss']});
    watcher.on('ready', function () { console.log('ready') });

    watcher.on('change', function (filepath, root, stat) {
        console.log('file changed', filepath);
        if (/\.scss/.test(filepath)){
            runSass(filepath);
        }
        else{
            runJs();
        }

    });
    watcher.on('add', function (filepath, root, stat) { console.log('file added', filepath); });
    watcher.on('delete', function (filepath, root) { console.log('file deleted', filepath); });
};

var runJs = function(first){
    console.log('Running Js build');

    try{
        var start = Date.now();
        duo.entry('entry.js')
            .installTo('../components')
            .use(babel())
            .use(jsx())
            .development(true)
            .run(function(err, results){

                if (err) console.error(err);

                if(results && results.code){
                    fs.writeFileSync(outJs, results.code);
                    var len = Buffer.byteLength(results.code);
                    if (first){
                        runSass();
                        if (argWatch){
                            watch();
                        }
                    }
                    console.log('JS all done, wrote %dkb in %dms', len / 1024 | 0, Date.now() - start);
                }

            });
    }
    catch(err) {
        console.log('Build Failed! ', err);
    }
};
var scssEntry = 'style.scss';
var runSass = function(fileName){
    var regex = new RegExp(scssEntry + '$');
    if (fileName !== undefined && !regex.test(fileName)){
        touch(join(__dirname, 'app', scssEntry));
        return;
    }
    console.log('Running Sass build');

    try{
        var start = Date.now();
        duo.entry(scssEntry)
            .installTo('../components')
            // .buildTo('../build/css')
            .use(sass())
            .development(true)
            .run(function(err, results){

                if(err) console.error(err);

                if(results && results.code){
                    fs.writeFileSync(outCss, results.code);
                    var len = Buffer.byteLength(results.code);
                    console.log('SCSS all done, wrote  %dkb in %dms', len / 1024 | 0, Date.now() - start);
                }
            });
    }
    catch(err) {
        console.log('Build Failed! ', err);
    }
};

runJs(true);