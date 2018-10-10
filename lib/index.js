#!/usr/bin/env node
const cli = require('commander');
const getStdin = require('get-stdin');
const generator = require('./generator');

cli
  .version('0.0.4')
  .usage('json-schema.yaml -y -l es_MX -r user')
  .option('-r, --rootSchema <value>', 'Set root schema from definitions')
  .option('-l, --locale [value]', 'Faker locale. Review Faker.js for more details.')
  .option('-i, --max-items <n>', 'Configure a maximum amount of items to generate in an array. This will override the maximum items found inside a JSON Schema', parseInt)
  .option('-m, --max-length <n>', 'Configure a maximum length to allow generating strings for. This will override the maximum length found inside a JSON Schema', parseInt)
  .option('-p, --optionals-probability <n>', 'When 0.0, only required properties will be generated; when 1.0, all properties are generated', parseFloat)
  .option('-y, --yaml', 'YAML input')
  .parse(process.argv);

const [fileName] = cli.args;
const settings = {};

if (cli.maxItems) {
  settings.maxItems = cli.maxItems;
}

if (cli.maxLength) {
  settings.maxLength = cli.maxLength;
}
if (cli.optionalsProbability) {
  settings.optionalsProbability = cli.optionalsProbability;
}

const locale = cli.locale ? cli.locale : 'en';


function getInput(argFileName) {
  if (argFileName !== undefined) {
    return generator.readFile(argFileName);
  }
  return getStdin();
}

const generate = generator.configure(settings, locale, getInput);

generate(fileName, cli.rootSchema, cli.yaml)
  .then((out) => {
    console.log(JSON.stringify(out, null, 2));
  })
  .catch((err) => {
    if (err.message === 'Either <input> or stdin is required.') {
      console.error(err.message);
      cli.help();
    } else {
      console.error(err);
    }


    process.exit(1);
  });
