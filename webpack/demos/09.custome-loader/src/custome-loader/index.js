const { validate } = require("schema-utils");
const schema = require("./options.json"); // 配置项的校验规则

module.exports.raw = true;

module.exports = function loader(source) {
  const { version, webpack } = this;

  // 获取用户传递给 loader 的配置项
  const options = this.getOptions();

  // 校验配置项是否符合 schema 规范，不符合会抛出错误
  validate(schema, options, "Loader");

  const newSource = `
  /**
   * Loader API Version: ${version}
   * Is this in "webpack mode": ${webpack}
   */
  /**
   * Original Source From Loader
   */
  ${source}`;

  return `${newSource}`;
}
