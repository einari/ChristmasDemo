    /// <binding />
module.exports = function (grunt) {
    var sourceFilesToIgnore = [
        "wwwroot/**/*.js",
        "node_modules/**/*.js",
        "bower_components/**/*.js",
        "jspm_packages/**/*.js",
        "Scripts/**/*.js",
        "bin/**/*.js",
        "wallaby.js",
        "gruntfile.js"
    ];

    var sourceFiles = [
        "**/*.js",
        "!wwwroot/**/*.js",
        "!node_modules/**/*.js",
        "!bower_components/**/*.js",
        "!jspm_packages/**/*.js",
        "!Scripts/**/*.js",
        "!bin/**/*.js",
        "!wallaby.js",
        "!gruntfile.js"
    ];
    

    var filesToCopy = [
        "**/*.html",
        "Scripts/**/*.*",
        "fonts/**/*.*",
        "styles/**/*.*",
        "images/**/*.*",
        "assets/**/*.*",
        "bower_components/**/*.*",
        "jspm_packages/**/*.*",
        "!wwwroot/**/*.html"
    ];

    var styleFiles = [
        "**/*.less"
    ];
    
    var dnxFiles = [
        "**/*.cs",
        "project.json"
    ];

    console.log("Current directory : " + process.cwd());

    var outputRoot = "wwwroot/";

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-exec");


    var exec = require("child_process").exec;
    var chalk = require('chalk');
    var chokidar = require('chokidar');
    var babel = require('babel');
    var babelOptions = {
        sourceRoot: "./",
        sourceMaps: "inline",
        //plugins: ["syntax-decorators"],
        ignore: sourceFilesToIgnore
    };

    function handleSourceFile(path) {
        grunt.log.writeln("Handling : " + path);
        var fileContent = grunt.file.read(path);
        try {
            babelOptions.sourceFileName = path;
            var transformed = babel.transform(fileContent, babelOptions);

            var destination = outputRoot + path;
            grunt.log.writeln("Writing transpiled version to : " + destination);
            grunt.file.write(destination, transformed.code);
            grunt.log.writeln("Handled : " + path);
        } catch (ex) {
            grunt.log.writeln("Error : " + ex);
        }
    }

    function handleCopyingFile(path) {
        grunt.log.writeln("Copy : " + path);
        grunt.file.copy(path, outputRoot + path);
        grunt.log.writeln("Copied : " + path);
    }

    function handleStyleFile(path) {
        console.log("Handle styles");
        try {
            grunt.task.run("less");
        }  catch (ex) {
            console.log("Error");
        }
    }



    grunt.initConfig({
        exec: {
            npm: "npm install",
            jspm: "jspm install -y",
            bower: "bower install -V",
            bower_update: "bower update"
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: filesToCopy,
                        dest: outputRoot
                    }
                ]
            }
        },
        babel: {
            options: babelOptions,
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: ".",
                        src: sourceFiles,
                        dest: "wwwroot"
                    }
                ]
            }
        },

        less: {
            development: {
                options: {
                    strictImports: true,
                    paths: ["Content"],
                    sourceMap: true,
                    sourceMapFilename: "style.css.map"
                },
                files: {
                    "wwwroot/Content/style.css": "Content/style.less"
                }
            }
        }
    });
    
    function dnx(options) {
        var cmd = "dnx";
        var cp = null;
        console.log("DNX");


        cp = exec("dnx --configuration Debug web", "", function (err, stdout, stderr) {
            console.log("DNX running");
        }.bind(this));

        var captureOutput = function (child, output) {
            if (grunt.option('color') === false) {
                child.on('data', function (data) {
                    output.write(chalk.stripColor(data));
                });
            } else {
                child.pipe(output);
            }
        };

        grunt.verbose.writeln('Command:', chalk.yellow(cmd));

        if (options.stdout || grunt.option('verbose')) {
            captureOutput(cp.stdout, process.stdout);
        }

        if (options.stderr || grunt.option('verbose')) {
            captureOutput(cp.stderr, process.stderr);
        }

        if (options.stdin) {
            process.stdin.resume();
            process.stdin.setEncoding('utf8');

            if (options.stdinRawMode && process.stdin.isTTY) {
                process.stdin.setRawMode(true);
            }

            process.stdin.pipe(cp.stdin);
        }

        return cp;
    }
    

    grunt.registerTask("watch", "", function () {
        var done = this.async();

        var watcher = chokidar.watch(".", {
            persistent: true,
            ignored: "wwwroot/**/*",
            ignoreInitial: true
        });
        grunt.log.writeln("Watching");

        var options = this.options({
            stdout: true,
            stderr: true,
            stdin: true,
            failOnError: true,
            stdinRawMode: false
        });
        var dnx_process = dnx(options);
        
        function handleDnx(path) {
            dnx_process.kill();
            dnx_process = dnx(options);
        }

        function newOrChanged(path) {
            console.log("Changed : " + path);
            if (grunt.file.isMatch(sourceFiles, path)) handleSourceFile(path);
            if (grunt.file.isMatch(filesToCopy, path)) handleCopyingFile(path);
            if (grunt.file.isMatch(styleFiles, path)) handleStyleFile(path);
            if (grunt.file.isMatch(dnxFiles, path)) handleDnx(path);
        }

        function deleted(path) {
            grunt.log.writeln("Delete : " + path);
            grunt.file.delete(outputRoot + path);
            grunt.log.writeln("Deleted : " + path);
        }

        watcher
            .on("add", newOrChanged)
            .on("change", newOrChanged)
            .on("unlink", deleted);
    });

    grunt.registerTask("staticBabel", "", function () {
        var files = grunt.file.expand(sourceFiles);

        files.forEach(function (file) {
            handleSourceFile(file);
        });
    });


    // DEBUG=express:* node app


    grunt.registerTask("default", ["exec", "less", "copy", "staticBabel"]);
    
    
    
};