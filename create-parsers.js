var watch = require('watch'),
    peg = require("pegjs"),
    fs = require('fs');

function createParsers() {
    fs.readFile('src/parsers/markdown-paragraph-parser.pegjs', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }

        console.log('creating parser for src/parsers/markdown-paragraph-parser.pegjs');
        
        var parserSource = peg.generate(data, {
            output: 'source',
            exportVar: 'MarkdownParagraphParser',
            format: 'globals'
        });

        fs.writeFile('dist/markdown-paragraph-parser.js', parserSource, 'utf-8', function(err) {
            if (err) throw err;
        });
    });
}

if (process.argv.indexOf('--watching') !== -1) {
    watch.watchTree('./src/parsers', function() {
        createParsers();
    });
}
else {
    createParsers();
}