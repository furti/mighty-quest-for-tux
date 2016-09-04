module.exports = {
    entry: "./src/ts/Main.tsx",
    output: {
        filename: "./dist/app.js",
    },

    watch: true,

    // Enable sourcemaps for debugging webpack's output.
    // devtool: "source-map",

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
        "@types/base64-js": "base64js"
    }
};
