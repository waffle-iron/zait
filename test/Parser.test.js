import Parser from '../src/zait/modules/Parser';
import {assert} from 'chai';

describe('Configuration handler', function () {

  let configJson;
  let configYml;

  before(function () {
    configJson = `{
      "commands": [
        {
          "GET": {
            "url": "http://google.com"
          }
        },
        {
          "GET": {
            "url": "http://mail.ru"
          }
        },
        {
          "GET": {
            "url": "http://yandex.ru"
          }
        }
      ]
    }`;
    configYml = `---
  commands: 
    - 
      GET: 
        url: "http://google.com"
    - 
      GET: 
        url: "http://mail.ru"
    - 
      GET: 
        url: "http://yandex.ru"`;
  });

  describe('Get parsedConfig', function () {

    it('should return object when parser is json', function () {
      const parser = new Parser('json', configJson);

      assert.isObject(parser.parsedConfig);
    });

    it('should return object when parser is yml', function () {
      const parser = new Parser('yml', configYml);

      assert.isObject(parser.parsedConfig);
    });

    it('should throws error when parser does not exist', function () {
      const parser = new Parser('nonexistenparser', configJson);

      let getterThrowsErr = false;

      try {
        parser.parsedConfig;
      } catch (e) {
        getterThrowsErr = true;
      }

      assert.isTrue(getterThrowsErr, 'should throw error');
    });

    /*it('should return object when parser is yml', function () {
      assert.isObject(parser.parsedConfig);
    });*/
  });

  describe('Get parsed commands', function () {
    it('should returns array of commands', function () {
      const parser = new Parser('json', configJson);

      assert.isArray(parser.parsedCommands);
    });
  });

  describe('Get reporter', function () {
    it('should return default reporter(json)', function () {
      const parser = new Parser('json', '{}');

      assert.strictEqual(parser.reporter.name, 'json');
    });

    it('should returns reporter object with reporter name, when reporter specified by string', function () {
      const parser = new Parser('json', '{ "reporter": "yaml" }');
  
      assert.strictEqual(parser.reporter.name, 'yaml');
    });

    it('should returns object with options and name, when reporter specified by object', function () {
      const jsonConf = JSON.stringify({
        reporter: {
          name: 'yaml',
          report_path: './zait.yml',
          some_option_for_test: 'test'
        }
      });
      const parser = new Parser('json', jsonConf);

     assert.deepEqual(parser.reporter, {
       name: 'yaml',
       options: {
         report_path: './zait.yml',
         some_option_for_test: 'test'
       }
     });
    });
  });
});
