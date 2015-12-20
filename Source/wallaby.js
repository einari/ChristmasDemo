var babel = require('babel');

module.exports = function (wallaby) {
    return {
        
        debug: true, // Enable this to get debugging info in the console
        testFramework: "jasmine@2.1.3",
        files: [
            { pattern: 'jspm_packages/system.js', instrument: false },
            
            { pattern: 'config.js', instrument: false },
            { pattern: 'build.js', instrument: false, load: false },

            { pattern: 'sinon-1.15.0.js', instrument: false },
            { pattern: "**/*.js", load: false }, 
                        
            "!Specs/**/*.js",
            "!node_modules/**/*.js",
            "!jspm_packages/github/**/*.js",
            "!jspm_packages/npm/**/*.js",
            "!bower_components/**/*.js",
            "!wwwroot/**/*.js"
        ],
        tests: [
            { pattern: 'Specs/**/*.js', load: false }
        ],
        compilers: {
            '**/*.js': wallaby.compilers.babel({
                babel: babel,
                sourceMap: true,
                optional: [
                    "es7.decorators"
                ]
            })
        },

        
        middleware: (app, express) => {
            app.use('/jspm_packages',
                    express.static(
                        require('path').join(__dirname, 'jspm_packages')));
        },

        bootstrap: function (wallaby) {
            // Preventing wallaby from starting the test run
            wallaby.delayStart();

            var promises = [];
            for (var i = 0, len = wallaby.tests.length; i < len; i++) {
                // loading wallaby tests
                promises.push(System.import(wallaby.tests[i].replace(/\.js$/, '')));
            }

            // starting wallaby test run when everything require is loaded
            Promise.all(promises).then(function () {
                wallaby.start();
            });
        }
    };
};