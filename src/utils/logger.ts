/**
 * Frontend logger with Winston-style levels.
 * Browser demo cannot use Node Winston; this module mirrors level APIs for workflow tracing.
 */

type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

const LEVEL_ORDER: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const CURRENT: LogLevel = 'debug';

/** Formats a structured log line for DevTools inspection. */
function emit(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (LEVEL_ORDER[level] > LEVEL_ORDER[CURRENT]) return;
  const stamp = new Date().toISOString();
  const payload = meta ? { message, ...meta } : message;
  const prefix = `[Meridian][${level.toUpperCase()}] ${stamp}`;
  switch (level) {
    case 'error':
      console.error(prefix, payload);
      break;
    case 'warn':
      console.warn(prefix, payload);
      break;
    default:
      console.log(prefix, payload);
  }
}

export const logger = {
  error: (message: string, meta?: Record<string, unknown>) => emit('error', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => emit('warn', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => emit('info', message, meta),
  http: (message: string, meta?: Record<string, unknown>) => emit('http', message, meta),
  verbose: (message: string, meta?: Record<string, unknown>) => emit('verbose', message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => emit('debug', message, meta),
  silly: (message: string, meta?: Record<string, unknown>) => emit('silly', message, meta),
};
