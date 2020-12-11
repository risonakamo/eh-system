const MiniCssExtractPlugin=require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin=require("fork-ts-checker-webpack-plugin");
// const CopyPlugin=require("copy-webpack-plugin");
const WebpackBar=require("webpackbar");

module.exports=(env)=>{
    env=env || {};

    var mode=env.prod?"production":"development";

    return {
        mode,
        entry:{
            ehviewer:"./ehviewer/ehviewer-index.tsx",
            abexplore:"./albumexplore/abexplore-router.tsx"
        },
        output:{
            path:`${__dirname}/build`,
            filename:"[name]-build.js"
        },

        module:{
            rules:[
                {
                    test:/\.(tsx|ts|js|jsx)$/,
                    exclude:/node_modules/,
                    use:{
                        loader:"babel-loader",
                        options:{
                            presets:["@babel/preset-react","@babel/preset-typescript"]
                        }
                    }
                },
                {
                    test:/\.(less|css)$/,
                    use:[
                        MiniCssExtractPlugin.loader,
                        {loader:"css-loader",options:{url:false}},
                        {loader:"less-loader"}
                    ]
                }
            ]
        },

        plugins:[
            new MiniCssExtractPlugin({
                filename:"[name]-build.css"
            }),

            new ForkTsCheckerWebpackPlugin(),
            new WebpackBar()

            // new CopyPlugin([
            //     {from:"src/index.html",to:"../"}
            // ]),
        ],

        resolve:{
            extensions:[".tsx",".ts",".jsx",".js"]
        },

        stats:{
            entrypoints:false,
            modules:false,
            chunks:false,
            assets:false
        },

        devtool:"eval-source-map"
    };
};