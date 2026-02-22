type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

const formatLog = (entry: LogEntry): string => {
  const { timestamp, level, message, data } = entry;
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
};

const createLogEntry = (level: LogLevel, message: string, data?: unknown): LogEntry => ({
  timestamp: new Date().toISOString(),
  level,
  message,
  data,
});

export const logger = {
  info: (message: string, data?: unknown): void => {
    const entry = createLogEntry('info', message, data);
    console.log(formatLog(entry));
  },

  warn: (message: string, data?: unknown): void => {
    const entry = createLogEntry('warn', message, data);
    console.warn(formatLog(entry));
  },

  error: (message: string, data?: unknown): void => {
    const entry = createLogEntry('error', message, data);
    console.error(formatLog(entry));
  },

  debug: (message: string, data?: unknown): void => {
    if (process.env.NODE_ENV === 'development') {
      const entry = createLogEntry('debug', message, data);
      console.debug(formatLog(entry));
    }
  },

  request: (method: string, url: string, statusCode: number, duration: number): void => {
    const message = `${method} ${url} ${statusCode} - ${duration}ms`;
    const entry = createLogEntry('info', message);
    console.log(formatLog(entry));
  },
};

export default logger;
