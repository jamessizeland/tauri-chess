// * Applied on save due to .vscode/settings.json configuring this project to format on save.
// https://prettier.io/docs/en/options.html
module.exports = {
  semi: true, // Add a semicolon at the end of every statement.
  trailingComma: 'all', // Print trailing commas wherever possible when multi-line. (A single-line array, for example, never gets trailing commas.)
  jsxSingleQuote: false, // Use single quotes instead of double quotes in JSX.
  singleQuote: true,
  printWidth: 80, // Specify the line length that the printer will wrap on.
  proseWrap: 'preserve', // wrap markdown text as-is since some services use a linebreak-sensitive renderer, e.g. GitHub comment and BitBucket.
  endOfLine: 'auto',
};
