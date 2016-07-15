import YamlReporter from '../src/zait/modules/Reporters/YamlReporter';
import {assert} from 'chai';
import fs from 'fs';

describe('YAML Reporter', function () {

  describe('report()', function () {
    let metrics;
    let options = {};

    before(function () {
      metrics = {
        some: 'Just',
        metrics: 'Do',
        for_test: 'It'
      };
    });

    beforeEach(function () {
      try {
        fs.unlinkSync(options.report_path);
      } catch (e) {}
    });

    it('report file should exists', function () {
      options.report_path = './zait_report.yml';
      
      const yamlReporter = new YamlReporter(metrics, options, 'test');
      
      yamlReporter.report();
      
      assert.isTrue(fs.statSync(options.report_path).isFile());
    });

    it('should throws error when it can\'t reports', function () {
      options.report_path = '/zait_cant_report_here';

      const yamlReporter = new YamlReporter(metrics, options, 'test');

      assert.throws(yamlReporter.report)
    });

    it('report status code should be zero', function () {
      options.report_path = './zait_report.yml';

      const yamlReporter = new YamlReporter(metrics, options, 'test');

      yamlReporter.report();

      assert.strictEqual(yamlReporter.reportStatusCode, 0);
    });

    it('report status code should be non zero', function () {
      options.report_path = '/zait_cant_report_here';

      const yamlReporter = new YamlReporter(metrics, options, 'test');
      
      yamlReporter.report();

      assert.strictEqual(yamlReporter.reportStatusCode, 1);
    });
  })
});