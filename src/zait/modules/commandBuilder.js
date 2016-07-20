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

    parsedCmd.opts.method = methodName;
    parsedCmd.url = cmd[methodName].url;

    /* eslint-disable */

    delete(cmd[methodName].url); // FIXME do not reassigne

    /* eslint-enable*/

    for (const opt in cmd[methodName]) {
      /* istanbul ignore else */
      if (cmd[methodName].hasOwnProperty(opt)) {
        parsedCmd.opts[opt] = cmd[methodName][opt];
      }
    }

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
