#bunyan-decorator

**bunyan-decorator** enables you to log the result of functions that return a promise or a value.

 
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


// Now decorator you class method
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

### Extractors
Extractors enable you to modify the result logged by the bunyan decorator

```
class MyClass {
  // This extractor ensure the promise result is not logged
  @log(Level.info, { extractor: result => {} })
  searchById(req, res) {
    return req.services[this._serviceClass]
      .byId(req.params.id)
      .then(json(res))
      .catch(error(res));
  }
}
```

## Example log record

Note all log records include all default bunyan property as well as the class name, the class method, the elapsed time, and the result (unless an extractor is used).

#### Pretty
```
02:12:41.894Z  INFO ecl-registration: SchoolsService.all(...) (module=SchoolsService, method=all(...), elapsedTime=428.553181)
    result: [
      {
        "id": "sampleschoolid1",
        "location": {
          "geo": {
            "lat": -1,
            "lon": -1
          },
          "address": {
            "street": "10 street rd",
            "city": "littleton",
            "state": "ma",
            "zip": "01146"
          }
        },
        "type": "school",
        "name": "sampleschoolid1",
        "district": {
          "id": "district-1",
          "name": "District One",
          "type": "district"
        },
        "group": {
          "name": "School Group One"
        },
        "created": "2017-02-16T13:36:01.781Z"
      }
    ]
```

#### Raw
```json
"name":"ecl-registration","hostname":"Carmines-MacBook-Pro-7.local","pid":58820,"level":30,"module":"ExpressServer","method":"listen","msg":"up
 and running in development @: Carmines-MacBook-Pro-7.local on port: 3003}","time":"2017-02-24T02:15:38.065Z","v":0}
{"name":"ecl-registration","hostname":"Carmines-MacBook-Pro-7.local","pid":58820,"level":30,"module":"SchoolsService","method":"all(...)","elaps
edTime":404.09158199999996,"result":[{"id":"sampleschoolid1","location":{"geo":{"lat":-1,"lon":-1},"address":{"street":"10 street rd","city":"li
ttleton","state":"ma","zip":"01146"}},"type":"school","name":"sampleschoolid1","district":{"id":"district-1","name":"District One","type":"distr
ict"},"group":{"name":"School Group One"},"created":"2017-02-16T13:36:01.781Z"}],"msg":"SchoolsService.all(...)","time":"2017-02-24T02:15:41.487
Z","v":0}
{"name":"ecl-registration","hostname":"Carmines-MacBook-Pro-7.local","pid":58820,"level":30,"module":"Controller","method":"all(...)","elapsedTi
me":410.745346,"msg":"Controller.all(...)","time":"2017-02-24T02:15:41.494Z","v":0}
```


## License
MIT