/**
 *
 * Time receiver class
 *
 * @constructor
 *
 * @param {Object} casper Casper instance
 *
 */
class TimeReceiver {
  constructor(casper) {
    this.casper = casper;
  }

  /**
   * Set page loading time
   *
   * @param {String} url Url of page
   * @param {Object} metricsObjRef Reference for metrics object where metrics
   * will be set
   */
  setPageLoadingTime(metricsObjRef) {
    let startTime;
    let endTime;

    /**
     * Timeout event handler
     *
     * @inner
     */
    const timeoutHandler = () => {
      endTime = new Date().getTime();

      metricsObjRef.loadTime = endTime - startTime;
      metricsObjRef.status = 'timeout';

      this.casper.removeListener('timeout', timeoutHandler);
      this.casper.removeListener('page.resource.received', receiveHandler);
    };

    /**
     * Request handler to set start time of page loading
     *
     * @inner
     */
    const requestHandler = (resource) => {
      startTime = new Date().getTime();

      this.casper.removeListener('page.resource.requested', requestHandler);
    };

    /**
     * Receive handler to set end time of page loading
     * and clearing.
     *
     * @inner
     */
    const receiveHandler = (resource) => {
      endTime = new Date().getTime();

      metricsObjRef.loadTime = endTime - startTime;
      if (resource.status !== null) {
        metricsObjRef.status = resource.status;
      } else {
        metricsObjRef.status = 'load error';
      }

      this.casper.removeListener('timeout', timeoutHandler);
      this.casper.removeListener('page.resource.received', receiveHandler);
    };

    /**
     * @todo Add jsdoc for events events
     */
    this.casper.on('page.resource.requested', requestHandler);
    this.casper.on('stepTimeout', timeoutHandler);
    this.casper.on('page.resource.received', receiveHandler);
  }
}

export default TimeReceiver;
