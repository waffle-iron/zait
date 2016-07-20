/** @module Reporters */

import Reporter from './Reporter';
import json2yaml from 'json2yaml';
import fs from 'fs';

/**
 * YAML Reporter class
 * @extends Reporter
 */
class YamlReporter extends Reporter {
  /**
   * Initialize reporter
   *
   * @param {Object} metrics Metrics
   * @param {Object|Undefined} options Reporter options
   * @param {String} env Get environment for testing
   */
  constructor(metrics, options = {}, env = 'prod') {
    if (env === 'test') {
      fs.write = fs.writeFileSync;
    }

    const defaultOptions = {
      report_path: './zait.report.yml'
    };

    super(metrics, Object.assign(defaultOptions, options));
  }

  /**
   * Output YAML report file
   */
  report() {
    const yamlReport = json2yaml.stringify(this._metrics);

    try {
      fs.write(this._options.report_path, yamlReport);

      this._reportSuccessMsg = `Success! YAML report was wrote in ${this._options.report_path}`;
      this.reportStatusCode = 0;
    } catch (e) {
      this.reportStatusCode = 1;

      this._reportFailMsg = `Failed! ${e}`; // TODO: remove fail string
    }
  }
}

export default YamlReporter;
