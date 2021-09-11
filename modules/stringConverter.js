class StringConverter {
  static setBold = (string) => `**${string}**`;
  static setItalic = (string) => `*${string}*`;
  static setCode = (string) => "```" + string + "```";
}

module.exports = StringConverter;
