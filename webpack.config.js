var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/ts/Main.tsx",
    output: {
        filename: "./dist/app.js",
    },

    watch: process.argv.indexOf('--watching') !== -1,

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    // React and React DOM come as globa scripts
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "marked": "marked",
        "classnames": 'classNames',
        "q": "Q",
        "@types/base64-js": "base64js",
        "codemirror": "CodeMirror"
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: './node_modules/react/dist/react.js', to: './dist/react.js' },
            { from: './node_modules/react-dom/dist/react-dom.js', to: './dist/react-dom.js' },
            { from: './node_modules/classnames/index.js', to: './dist/classnames.js' },
            { from: './node_modules/marked/marked.min.js', to: './dist/marked.min.js' },
            { from: './node_modules/text-encoder-lite/index.js', to: './dist/text-encoder-lite.js' },
            { from: './node_modules/base64-js/base64js.min.js', to: './dist/base64js.min.js' },
            { from: './node_modules/fast-levenshtein/levenshtein.js', to: './dist/levenshtein.js' },
            { from: './node_modules/q/q.js', to: './dist/q.js' },
            { from: './node_modules/codemirror/lib/codemirror.js', to: './dist/codemirror.js' },
            { from: './node_modules/codemirror/lib/codemirror.css', to: './dist/codemirror.css' },
            { from: './node_modules/codemirror/theme/material.css', to: './dist/cm-material.css' },
            { from: './node_modules/codemirror/mode/javascript/javascript.js', to: './dist/js-mode.js' },


            { from: './node_modules/codemirror/addon/lint/lint.js', to: './dist/cm-lint.js' },
            { from: './node_modules/codemirror/addon/lint/lint.css', to: './dist/cm-lint.css' },
            { from: './node_modules/codemirror/addon/lint/json-lint.js', to: './dist/cm-json-lint.js' },
            { from: './node_modules/jsonlint/lib/jsonlint.js', to: './dist/json-lint.js' }
        ], { copyUnmodified: true })
    ]
};
