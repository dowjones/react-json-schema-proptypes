# react-json-schema-proptypes

Build React PropTypes using a JSON schema.

## Usage

`npm install --save react-json-schema-proptypes`

```js
import propTypeSchema from 'react-json-schema-proptypes';

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
import propTypeSchema from 'react-json-schema-proptypes';
import Image from 'components/image';
import Comment from 'components/comment';

...

class Article extends React.Component {
  static propTypes = propTypeSchema({
    "type": "object",
    "properties": {
      "image": Image.propTypes.__schema,
      "comments": {
        "type": "array",
        "items": Comment.propTypes.__schema
      }
    }
  })

  render() {
    ...
  }
}

```

## Caveats

Not all features of JSON-Schema are currently supported, for example cross-validation with other props, so we recommend keeping the schema simple and type-based rather than logic-based.
