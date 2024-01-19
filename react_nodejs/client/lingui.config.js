/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ["en", "bf", "fr"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/main",
      include: ["src"],
    },
  ],
  format: "po",
};