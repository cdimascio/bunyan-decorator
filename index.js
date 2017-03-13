const bunyan = require('bunyan');

const _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  } return target;
};

const Level = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
  trace: 'trace',
};

const isLevel = s => s === Level.error ||
  s === Level.warn ||
  s === Level.info ||
  s === Level.debug ||
  s === Level.trace;

function Logger(bunyanLogger) {
  this.logger = bunyanLogger
    ? this.logger = bunyanLogger
    : this.logger = bunyan.createLogger({
      name: process.env.APP_ID || 'my-app'
    });

  this.Level = Level;
}

Logger.prototype.log = function (msg, level, options) {
  if (options && !options.extractor) {
    throw new Error('options missing extractor');
  }
  options = options || { extractor: res => res };
  level = level || 'info';
  const self = this;

  // rebuild options object based on params
  const opts = {};
  if (isLevel(msg)) {
    opts.extractor = (level && level.extractor) || options.extractor;
    opts.level = msg;
    opts.msg = null;
  } else if (msg.extractor) {
    opts.extractor = (msg && msg.extractor) || options.extractor;
    opts.level = 'info';
    opts.msg = null;
  }

  return (target, key, descriptor) => {
    if (typeof descriptor.value !== 'function') {
      throw new SyntaxError('Only functions can be marked with log');
    }
    return _extends({
      descriptor,
      value: function logWrapper() {
        const args = arguments;
        const module = this.constructor.name || target.constructor.name;
        const method = `${key}(...)`;
        opts.msg = opts.msg || `${module}.${method}`;
        const t0 = process.hrtime();

        const success = r => {
          const elapsedTimeSec = process.hrtime(t0)[0];
          const elapsedTimeNano = process.hrtime(t0)[1];
          const elapsedTime = elapsedTimeSec * Math.pow(10, 3) + elapsedTimeNano *  Math.pow(10, -6);
          self.logger[opts.level]({ module, method, elapsedTime, result: opts.extractor(r) }, opts.msg);
          return r;
        };

        const fail = e => {
          self.logger.error({ module, method, err: e }, opts.msg);
          throw e;
        };

        try {
          const res = descriptor.value.apply(this, args);
          return res && res.then
            ? res.then(success).catch(fail)
            : success(res);
        } catch (e) {
          throw fail(e);
        }
      },
    });
  };
};


module.exports = Logger
