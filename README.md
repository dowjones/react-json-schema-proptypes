# react-json-schema-proptypes

Build React PropTypes using a JSON Schema with introspection support.

## Usage

`npm install --save react-json-schema-proptypes`

```js
import propTypeSchema from 'react-json-schema-proptypes';
import React from 'react';

...

const schema = {
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    }
  }
};

class Article extends React.Component {
  static propTypes = propTypeSchema(schema)

  render() {
    ...
  }
}

```

### Introspection

Creating `propTypes` using react-json-schema-proptypes exposes the schema object on the component.
To get the schema, you can use the exported `getComponentSchema` function.

### Composing schemas from child components

```js
import propTypeSchema, {getComponentSchema} from 'react-json-schema-proptypes';
import Image from 'components/image';
import Comment from 'components/comment';
import React from 'react';

...

class Article extends React.Component {
  static propTypes = propTypeSchema({
    "type": "object",
    "properties": {
      "image": getComponentSchema(Image), // Note: Things you compose must have been curated with react-json-schema-proptypes
      "comments": {
        "type": "array",
        "items": getComponentSchema(Comment)
      }
    }
  })

  render() {
    ...
  }
}

```

#### You can also update an existing schema by passing in objects that will override* it

```js
import propTypeSchema from 'react-json-schema-proptypes';
import BaseArticle from '../components/base-article';
import React from 'react';

...

class Article extends React.Component {
  static propTypes = propTypeSchema(BaseArticle.propTypes, {
    "properties": {
      "newProperty": { "type": "string" }
    }
  }) // Note: extending things in this way requires them to have also have been curated with react-json-schema-proptypes

  render() {
    ...
  }
}

```

_* This will create a new object rather than mutating existing ones so you're safe to use it however you want._

## API

``` js
import createPropTypes, {getComponentSchema, Schema, SchemaSymbol} from 'react-json-schema-proptypes';

```

### createPropTypes(schema)

Given a JSON schema, return a React proptypes object.  

### getComponentSchema(Component)

Returns a component's schema from a component class. 

### SchemaSymbol

The Sympbol for react-json-schema-proptypes.

### Schema

#### Schema.element 
Is a schema that validates a React element.  (Gives a schema represetation equivalent to React.Element)

#### Schema.node
Is a schema that validates a React node.  (Gives a schema represetation equivalent to React.Node)

#### Schema.func
Is a schema that validates a function.


## Caveats

Not all features of JSON-Schema are currently supported, for example cross-validation with other props, so we recommend keeping the schema simple and type-based rather than logic-based.

## Local development

This project is built with [TypeScript](https://github.com/Microsoft/TypeScript).


Optionally, you would also need [DefinitelyTyped](http://definitelytyped.org/) to install/update TypeScript definition files.

```
npm install tsd -g
```
