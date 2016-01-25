# react-json-schema-proptypes

Build React PropTypes using a JSON Schema.

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

#### Introspection

Creating `propTypes` using react-json-schema-proptypes exposes the schema object on the static `propTypes` property of the component as `__schema`.

This allows you to explore the schema from an external source via `ComponentClass.propTypes.__schema`

#### Composing schemas from child components

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

##### You can also update an existing schema by passing in objects that will override* it

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

## Caveats

Not all features of JSON-Schema are currently supported, for example cross-validation with other props, so we recommend keeping the schema simple and type-based rather than logic-based.
