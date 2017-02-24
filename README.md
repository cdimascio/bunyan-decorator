#bunyan-decorator

## Install

`npm install bunyan-decorator`

## Usage

```javascript
const bunyan = require('bunyan');
const bunyand = require ('./bunyan-decorator');

const l = new Logger(bunyan.createLogger({
  name: 'my-app'
}));

const log = l.log;

class MyClass {
  @log(Level.info)
  searchById(req, res) {
    return req.services[this._serviceClass]
      .byId(req.params.id)
      .then(json(res))
      .catch(error(res));
  }
}
```

## License
MIT