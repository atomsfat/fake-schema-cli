/* eslint-env mocha */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const path = require('path');
const generator = require('./generator');


chai.use(chaiAsPromised);
const { expect } = chai;

describe('fake schema', () => {
  it('should generate JSON', () => {
    const generate = generator
      .configure({}, 'en', () => Promise.resolve(JSON.stringify({ type: 'integer' })));
    return expect(generate()).to.be.fulfilled;
  });

  it('should fail on bad schemaRoot', () => {
    const generate = generator
      .configure({}, 'en', () => Promise.resolve(JSON.stringify({ type: 'integer' })));

    return expect(generate(undefined, 'some'))
      .to.be.rejected;
  });

  it('should fail on bad JSON', () => {
    const generate = generator.configure({}, 'en', () => Promise.resolve('some'));
    return expect(generate(undefined, 'some'))
      .to.be.rejected;
  });

  it('should generate JSON', () => {
    const generate = generator
      .configure({}, 'en', () => Promise.resolve(JSON.stringify({ type: 'integer' })));
    return expect(generate()).to.be.fulfilled;
  });

  it('should read a File', () => {
    const promise = generator.readFile(path.resolve(__dirname, '../fixtures/InnerReferences.json'));
    return expect(promise).to.be.fulfilled;
  });

  it('should read a YAML and generate', () => {
    const generate = generator
      .configure({}, 'en', filename => generator.readFile(filename));

    return expect(generate(path.resolve(__dirname, '../fixtures/definitions.yaml'), undefined, true))
      .to.be.fulfilled;
  });

  it('should read a YAML and generate overriding root-schema', () => {
    const generate = generator.configure({}, 'en', filename => generator.readFile(filename));

    return expect(generate(path.resolve(__dirname, '../fixtures/definitions.yaml'), 'user', true))
      .to.eventually.have.property('name');
  });
});
