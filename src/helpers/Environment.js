/**
 * Access `process.env` in an environment helper
 * Usage: `EnvHelper.env`
 * - Other static methods can be added as needed per
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
 */
export class EnvHelper {
  /**
   * @returns `process.env`
   */
  static env = process.env;
  static whitespaceRegex = /\s+/;

  static getOtherChainID() {
    return Number(EnvHelper.env.REACT_APP_CHAINID || 0);
  }

}