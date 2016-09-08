var fs = require('fs'),
    eol = require('eol'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    watch = require('watch');

var specialFiles = {
    'welcome.md': function(fileContent, consoleContent) {
        consoleContent.welcome = processFileContent(fileContent);
    },
    'config.json': function(fileContent, consoleContent) {
        var config = JSON.parse(fileContent);

        consoleContent.executables = config.executables;

        consoleContent.__config = config;
    }
};

function processFileContent(fileContent) {
    fileContent = eol.lf(fileContent);
    fileContent = new Buffer(fileContent).toString('base64');

    return fileContent;
}

function createContentFile(fileName, fileContent) {
    var parsed = path.parse(fileName);

    return {
        content: processFileContent(fileContent),
        base: fileName,
        name: parsed.name,
        ext: parsed.ext
    };
}

function hasExecutableForFile(executables, fileName) {
    if (!executables) {
        return false;
    }

    for (var i in executables) {
        if (executables[i].file === fileName) {
            return true;
        }
    }

    return false;
}

function setFilePermissions(files, config) {
    if (!files) {
        return;
    }

    for (var fileName in files) {
        var file = files[fileName];

        if (!config.noRead || config.noRead.indexOf(file.base) === -1) {
            file.readable = true;
        }

        if (config.writeable && config.writeable.indexOf(file.base) !== -1) {
            file.writeable = true;
        }

        if (hasExecutableForFile(config.executables, file.base)) {
            file.executable = true;
        }
    }
}

/**
 * This badass here reads all files from the console folders and creates the content.json file.
 */
function createConsoleContent() {
    var srcPath = './src/content';
    var targetPath = './dist/content';
    var consoleFolders = fs.readdirSync(srcPath);

    if (!consoleFolders) {
        return;
    }

    consoleFolders.forEach(function(folderName) {
        var consoleSrcPath = srcPath + '/' + folderName;
        var consoleTargetPath = targetPath + '/' + folderName;

        var stats = fs.statSync(consoleSrcPath);

        if (!stats.isDirectory()) {
            return;
        }

        var files = fs.readdirSync(consoleSrcPath);

        if (!files || files.length === 0) {
            console.log('No files found for ' + consoleSrcPath);
        } else {
            console.log('Processing content ' + folderName);
            var consoleContent = {
                files: {}
            };

            files.forEach(function(file) {
                var fileContent = fs.readFileSync(consoleSrcPath + '/' + file, 'utf8');

                if (specialFiles[file]) {
                    specialFiles[file](fileContent, consoleContent);
                } else {
                    consoleContent.files[file] = createContentFile(file, fileContent);
                }
            });

            if (consoleContent.__config) {
                setFilePermissions(consoleContent.files, consoleContent.__config);
                delete consoleContent.__config;
            }

            mkdirp.sync(consoleTargetPath);

            fs.writeFileSync(consoleTargetPath + '/content.json', JSON.stringify(consoleContent), 'utf8');
        }
    });
}

if (process.argv.indexOf('--watching') !== -1) {
    watch.watchTree('./src/content', function() {
        createConsoleContent();
    });
}
else {
    createConsoleContent();
}