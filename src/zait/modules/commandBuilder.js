/** @module commandBuilder */

import typeOf from 'typeof';

/** @namespace */
const commandBuilder = { // TODO: Refactoring. Rename to commandTransformer and change the doc.
  /**
   * Parse a command to API kind
   *
   * @param   {Object|String} cmd Command to parse
   * @returns {Object} Parsed command (if not parsed command was string
   *                   object will make by default way)
   */
  buildCommand(cmd) {
    const parsedCmd = {};

    parsedCmd.opts = {};

    if (typeOf(cmd) === 'string') {
      parsedCmd.url = cmd;
      parsedCmd.opts.method = 'GET';

      return parsedCmd;
    }

    const methodName = Object.keys(cmd)[0];

    parsedCmd.url = cmd[methodName].url;
    parsedCmd.opts = Object.assign({ method: methodName }, cmd[methodName]);
    delete parsedCmd.opts.url; // FIXME Narrow place for perfomance, maybe undefined or loop(if)?

    return parsedCmd;
  },
  /**
   * Parse a commands to API kind
   *
   * @param   {Array} commands Commands to parse
   * @returns {Array} Array of parsed commands (if not parsed command was string
   *                   object will make by default way)
   */
  buildCommands(commands) {
    return commands.map(this.buildCommand);
  }
};

export default commandBuilder;
