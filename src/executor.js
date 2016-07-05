import {Casper} from 'casper';
import fs from 'fs';

import {metricsToArrayTable} from './modules/utils';
import {message} from './modules/cli';

import Parser from 'modules/Parser';
import TimeReceiver from './modules/TimeReceiver';
import reportersRegister from 'modules/Reporters/reportersRegister';

import typeOf from 'typeof';

const casper = Casper({
  verbose: true,
  exitOnError: false
});

//==========DEBUG MODE====================
casper.on('error', function (err) {
  this.log(err, 'error');
});

//========================================

const args = JSON.parse(casper.cli.get(0)); //JSON object of args passed by Python
const conf = fs.read(args.configPath);
const parser = new Parser(args.parser, conf);
const commands = parser.parsedCommands;
const timeReceiver = new TimeReceiver(casper);

let metrics = [];

casper.options.pageSettings.resourceTimeout = parser.parsedConfig.timeout || 1000;

casper.on('page.resource.requested', (res) => {
  message.print(`${res.method}: ${res.url}`);//TODO: make info message and trace mode
});

casper.on('page.resource.received', (res) => {
  //TODO: make error handlers

  switch (res.status / 100 | 0) {
    case 2:
      message.success(`${res.url} was loaded`);//TODO: make info message and trace mode
      break;
    case 3:
      message.print(`Redirect to ${res.redirectURL}`);
      break;
    default:
      message.err(`Error with ${res.url}`);
  }
});

casper.start().eachThen(commands, function (res) {
  const command = res.data;

  let curMetricIndex = metrics.push({
    url: command.url
  }) - 1;

  timeReceiver.setPageLoadingTime(metrics[curMetricIndex]);

  this.open(command.url, command.opts);
}).run();

casper.then(function () {
  message.table(metricsToArrayTable(metrics));

  let reporter;

  if (typeOf(parser.reporter) === 'string') {
    reporter = new reportersRegister[parser.reporter](metrics);
  } else {
    reporter = new reportersRegister[parser.reporter.name](metrics, parser.reporter.options);
  }

  reporter.report();

  if (reporter.reportStatusCode === 0) {
    message.success(reporter.reportLog);
  } else {
    message.err(reporter.reportLog);
  }

  casper.exit(reporter.reportStatusCode);
});

