import yaml from 'js-yaml';
import typeOf from 'typeof';
import commandBuilder from './commandTransformer';

/*
 * Parse error class
 */
export class ParserError extends Error {

  /**
   * Ser error message
   *
   * @param {String} message Error message
   */
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'ParserError';
  }
}

/**
 * Parser class
 */
class Parser {

  /**
   * Set parser config and parser type
   *
   * @param {String} config Raw Zait configuration
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Get parsed config file
   *
   * @throws {Error} Throw error if can't parse config.
   * @type {JSON}
   */
  get parsedConfig() {
    try {
      return yaml.load(this.config);
    } catch (e) {
      throw new ParserError(e.message);
    }
  }

  /**
   * Get parsed commands
   *
   * @type {Array}
   */
  get parsedCommands() {
    return commandBuilder.transformCommands(this.parsedConfig.commands);
  }

  /**
   * Get reporter
   *
   * @type {Object}
   */
  get reporter() {
    const reporter = {
      name: undefined,
      options: {}
    };

    if (!this.parsedConfig.reporter) {
      return { name: 'json' };
    }

    if (typeOf(this.parsedConfig.reporter) === 'string') {
      return { name: this.parsedConfig.reporter };
    }

    reporter.name = this.parsedConfig.reporter.name;
    reporter.options = Object.assign({}, this.parsedConfig.reporter);
    delete reporter.options.name;

    return reporter;
  }
}

export default Parser;
