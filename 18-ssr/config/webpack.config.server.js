const paths = require("./paths");
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const nodeExternals = require("webpack-node-externals");

const config = {
  mode: "production", // 프로덕션 모드로 설정하여 최적화 옵션들을 활성화
  entry: paths.ssrIndex, // 엔트리 경로
  target: "node", // node 환경에서 실행될 것이라는 점을 명시
  output: {
    path: paths.ssrBuild, // 빌드 경로
    filename: "server.js", // 파일 이름
    chunkFilename: "js/[name].chunk.js", // 청크 파일 이름
    publicPath: paths.publicUrlOrPath, // 정적 파일이 제공될 경로
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve("babel-loader"),
            options: {
              customize: require.resolve(
                "babel-preset-react-app/webpack-overrides"
              ),
              presets: [[require.resolve("babel-preset-react-app")]],
              plugins: [
                [
                  require.resolve("babel-plugin-named-asset-import"),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent:
                          "@svgr/webpack?-svgo,+titleProp,+ref![path]",
                      },
                    },
                  },
                ],
              ],
              cacheDirectory: true,
              cacheCompression: false,
              compact: false,
            },
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            loader: require.resolve("css-loader"),
          },
          {
            test: cssModuleRegex,
            loader: require.resolve("css-loader"),
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: require.resolve("css-loader"),
                options: {
                  exportOnlyLocals: true,
                },
              },
              require.resolve("sass-loader"),
            ],
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: require.resolve("css-loader"),
                options: {
                  modules: true,
                  exportOnlyLocals: true,
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              },
              require.resolve("sass-loader"),
            ],
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              emitFile: false,
              limit: 10000,
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              emitFile: false,
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".css", ".ts", ".tsx"],
  },
  externals: [nodeExternals()],
};

module.exports = config;
