
const jsf = require('json-schema-faker');
const YAML = require('yamljs');
const fs = require('fs');
const faker = require('faker');

module.exports = {

  configure(settings, locale, getInputPromise) {
    jsf.option(settings);
    jsf.extend('faker', () => {
      faker.locale = locale;
      return faker;
    });
    return function generate(fileName = undefined, rootSchema = undefined, yaml = false) {
      return getInputPromise(fileName)
        .then((str) => {
          if (!str) { throw new Error('Either <input> or stdin is required.'); }
          let schema = yaml ? YAML.parse(str) : JSON.parse(str);
          if (rootSchema !== undefined) {
            if (schema.definitions == null
              || schema.definitions === undefined) {
              throw new Error('To use root schema, object must have definitions');
            }
            if (schema.definitions[rootSchema] === null
              || schema.definitions[rootSchema] === undefined) {
              throw new Error(`Definitions [${Object.keys(schema.definitions).toString()}] doesn't contain ${rootSchema} schema`);
            }
            const root = { ...schema.definitions[rootSchema] };
            root.definitions = schema.definitions;
            schema = root;
          }
          return schema;
        }).then((schema) => jsf.resolve(schema));
    };
  },
  readFile(fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) { reject(err); } else { resolve(data); }
      });
    });
  },
};
