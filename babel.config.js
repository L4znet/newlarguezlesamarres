module.exports = function (api) {
     api.cache(true)
     return {
          presets: ["babel-preset-expo"],
          env: {
               production: {
                    plugins: ["react-native-paper/babel", ["@babel/plugin-transform-class-properties", { loose: true }], ["@babel/plugin-transform-private-methods", { loose: true }], ["@babel/plugin-transform-private-property-in-object", { loose: true }]],
               },
          },
     }
}
