/** @module commandTransformer */

import typeOf from 'typeof';

/** @namespace */
const commandTransformer = { // TODO: Refactoring. Rename to commandTransformer and change the doc.
  /**
   * Transform a command to API kind
   *
   * @param   {Object|String} cmd Command to transform
   * @returns {Object} Transformed command (if not parsed command was string
   *                   object will make by default way)
   */
  transformCommand(cmd) {
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
   * Transform commands to API kind
   *
   * @param   {Array} commands Commands to transform
   * @returns {Array} Array of transformed commands (if not parsed command was string
   *                   object will make by default way)
   */
  transformCommands(commands) {
    return commands.map(this.transformCommand);
  }
};

export default commandTransformer;
