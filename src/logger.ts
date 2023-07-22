import pino from 'pino';

// https://github.com/pinojs/pino/blob/master/docs/api.md#pinooptions-destination--logger
const logger = pino({
  level: 'info',
});

export default logger;
