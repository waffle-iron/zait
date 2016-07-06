import {metricsToArrayTable} from '../src/modules/utils';
import {assert} from 'chai';
import chalk from 'phantomjs-chalk';

describe('Utils',  function () {
  describe('metricsToArrayTable', function () {
    const metrics = [
      {
        url: 'domain.com',
        starttime: 1,
        endtime: 2,
        status: 200
      },
      {
        url: 'domain1.com',
        starttime: 100,
        endtime: 2000,
        status: 401
      }
    ];

    it('should returns an array', function () {
      assert.isArray(metricsToArrayTable(metrics));
    });

    it('should returns correct header', function () {
      assert.deepEqual(metricsToArrayTable(metrics)[0], ['url', 'starttime', 'endtime', 'status']);
    });

    it('the first row of metrics should contains green status message or contains status without ' +
      'color if cli doesn\'t support colors', function () {
      const isContainColor = metricsToArrayTable(metrics)[1][3].indexOf(chalk.styles.green.open);

      if (chalk.supportsColor) {
        assert.notStrictEqual(isContainColor, -1);
      } else {
        assert.strictEqual(isContainColor, -1);
      }
    });

    it('the second row of metrics should contains red status message or contains status without ' +
      'color if cli doesn\'t support colors', function () {
      const isContainColor = metricsToArrayTable(metrics)[2][3].indexOf(chalk.styles.red.open);

      if (chalk.supportsColor) {
        assert.notStrictEqual(isContainColor, -1);
      } else {
        assert.strictEqual(isContainColor, -1);
      }
    });

    it('should returns non colorized row when raw argument is true', function () {
      assert.strictEqual(String(metricsToArrayTable(metrics, true)[2][3]).indexOf(chalk.styles.red.open), -1);
    });
  });
});
