import {Casper} from 'casper';
import fs from 'fs';

import {metricsToArrayTable} from './modules/utils';
import {message} from './modules/cli';

import Parser from 'modules/Parser';
import TimeReceiver from './modules/TimeReceiver';
import reporters from 'modules/Reporters/reportersRegister';

const casper = Casper({
  verbose: true
});

//==========DEBUG MODE====================
casper.on('error', function (err) {
  this.log(err, 'error');
//  this.exit(1);
});

//========================================

const args = JSON.parse(casper.cli.get(0)); //JSON object of args passed by Python
const conf = fs.read(args.configPath);
const parser = new Parser(args.parser, conf);
const commands = parser.parsedCommands;
const timeReceiver = new TimeReceiver(casper);

let metrics = [];

casper.on('page.resource.requested', (res) => {
  message.print(`${res.method}: ${res.url}`);//TODO: make info message and trace mode
});

casper.on('page.resource.received', (res) => {
  message.print(`${res.url} was loaded`);//TODO: make info message and trace mode
});

casper.options.stepTimeout = parser.parsedConfig.timeout || 1000; //TODO: default parameters only in parser class. 

casper.options.stepTimeout = (timeout) => {
  message.warn(`Timeout ${timeout}ms was reached`);
};

casper.start().eachThen(commands, function (res) {
  const command = res.data;

  let curMetricIndex = metrics.push({
    url: command.url
  }) - 1;

  timeReceiver.setPageLoadingTime(metrics[curMetricIndex], command.url);

  this.open(command.url, command.opts);
}).run();

casper.then(function () {
  message.table(metricsToArrayTable(metrics));
  
  //TODO temp! for testing
  const reporterName = 'yaml';

  const reporter = new reporters[reporterName](metrics);

  reporter.report();

  if (reporter.reportStatusCode === 0) {
    message.success(reporter.reportLog);
  } else {
    message.err(reporter.reportLog);
  }

  casper.exit(reporter.reportStatusCode);
});
