# fake-schema-cli 

[![Build Status](https://travis-ci.org/atomsfat/fake-schema-cli.svg?branch=master)](https://travis-ci.org/github/atomsfat/fake-schema-cli)
[![npm version](https://badge.fury.io/js/fake-schema-cli.svg)](https://badge.fury.io/js/fake-schema-cli)

Another CLI for [json-schema-faker](https://www.npmjs.com/package/json-schema-faker). With Stdin support.

Based on
* https://github.com/oprogramador/json-schema-faker-cli
* https://github.com/json-schema-faker/website-jsf

## Install

`npm install -g fake-schema-cli`

## Usage

```bash
 Usage: fake-schema <file> -y -l es_MX -r user

  Options:

    -r, --rootSchema <value>         Set root schema from definitions, useful when faking Swagger specs.
    -l, --locale [value]             Faker locale. Review Faker.js for more details.
    -i, --max-items <n>              Configure a maximum amount of items to generate in an array. This will override the maximum items found inside a JSON Schema
    -m, --max-length <n>             Configure a maximum length to allow generating strings for. This will override the maximum length found inside a JSON Schema
    -p, --optionals-probability <n>  When 0.0, only required properties will be generated; when 1.0, all properties are generated
    -y, --yaml                       YAML input
    -h, --help                       output usage information

```

## Examples (using [httpie](https://httpie.org/doc) )

* Faking local JSON Schemes

`cat InnerReferences.yaml | fake-schema -y -l es_MX `

* Faking local JSON Schemes with color

`cat InnerReferences.yaml | fake-schema -y -l es_MX  | jq .`

* Faking remotes JSON Schemes

` http https://json-schema.org/learn/examples/address.schema.json | fake-schema
` curl --silent https://json-schema.org/learn/examples/address.schema.json | fake-schema

* Update result

`http https://json-schema.org/learn/examples/address.schema.json | node lib/index.js | jq '.locality|="atoms"'`


* Pipe web services
```bash
http https://json-schema.org/learn/examples/address.schema.json | fake-schema | http POST http://bin.org/post
```

* Save to file via redirect output

`cat InnerReferences.yaml | fake-schema -y -l es_MX  > file`

## Motivation

The [website-jsf](https://github.com/json-schema-faker/website-jsf) is awesome but I just want to write bash script to populate environments,.




```bash
#!/usr/bin/env bash

USER_ID=$(http :8080/swagger.yaml | fake-schema -y -r user | http POST :8080/api/user | jq .id)
http :8080/swagger.yaml | fake-schema -y -r purchase | jq  "'.user.id|=\"$USER_ID\"'" | http post :8080/api/purchase

```

##  Tools used on examples

* [httpie](https://httpie.org/doc)
* [JQ](https://stedolan.github.io/jq/)
* [jmespath](http://jmespath.org/)
