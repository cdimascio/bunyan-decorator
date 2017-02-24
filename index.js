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

Logger.prototype.log = function (msg, level = 'info', { extractor = res => res } = {}) {
  const self = this;
  const opts = {};
  if (isLevel(msg)) {
    opts.extractor = (level && level.extractor) || extractor;
    opts.level = msg;
    opts.msg = null;
  } else if (msg.extractor) {
    opts.extractor = (msg && msg.extractor) || extractor;
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
        const args = [...arguments];
        const module = this.constructor.name || target.constructor.name;
        const method = `${key}(...)`;
        opts.msg = opts.msg || `${module}.${method}`;
        const t0 = process.hrtime();

        const success = r => {
          const [elapsedTimeSec, elapsedTimeNano] = process.hrtime(t0);
          const elapsedTime = Math.pow(elapsedTimeSec, 3) + Math.pow(elapsedTimeNano, -6);
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
