/**@module Reporters*/

/**
 * Reporter interface
 */
class Reporter {
  /**
   * Initialize reporter
   *
   * @param {Object} metrics
   * @param {Object} options
   */
  constructor(metrics, options) {
    this.reportStatus = undefined;

    this._metrics = metrics;
    this._options = options;
    this._reportSuccessMsg = 'Success';
    this._reportFailMsg = 'Fail';
  }

  /**
   * Report metrics method
   * @abstract
   */
  report() {
    throw Error('Field is not implemented');
  }

  /**
   * Returns info string for logging
   *
   * @returns {String}
   */
  get reportLog() {
    switch (this.reportStatusCode) {
      case undefined:
        return 'Report status wasn\'t changed or it wasn\'t run. Can not figure out report status.';
      case 0:
        return this._reportSuccessMsg;
      case 1:
        return this._reportFailMsg;
    }
  }
}

export default Reporter;
