const paths = require("./paths");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const getClientEnvironment = require("./env");

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const publicUrl = paths.publicUrlOrPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

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
          // 자바스크립트를 위한 처리
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
          // CSS 를 위한 처리
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            loader: require.resolve("css-loader"),
          },
          // CSS Module을 위한 처리
          {
            test: cssModuleRegex,
            loader: require.resolve("css-loader"),
          },
          // Sass를 위한 처리
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
          // Sass + CSS Module을 위한 처리
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
          // url-loader를 위한 설정
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              emitFile: false,
              limit: 10000,
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          // 위에서 설정된 확장자를 제외한 파일들은
          // file-loader를 사용한다.
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
  externals: [nodeExternals(), new webpack.DefinePlugin(env.stringified)], // 환경변수를 주입해준다.],
};

module.exports = config;
