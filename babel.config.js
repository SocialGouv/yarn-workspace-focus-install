module.exports = {
  presets: [
    ["@babel/preset-env", { modules: false, targets: { node: "current" } }],
    [
      "@babel/preset-typescript",
      {
        onlyRemoveTypeImports: true,
      },
    ],
  ],
  plugins: [
    [
      "babel-plugin-module-resolver",
      {
        root: [require("./tsconfig.json").compilerOptions.baseUrl],
        extensions: [".ts"],
      },
    ],
  ],
  env: {
    test: {
      presets: [
        [
          "@babel/preset-env",
          {
            modules: "commonjs",
            targets: { node: "current" },
          },
        ],
      ],
    },
  },
};
