export default {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.[tj]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@vue|vue-router)/)" // Vue 関連のライブラリを変換対象に
  ],
};
