const log = (...args: unknown[]) => {
  if (!import.meta.env.DEV) return;

  console.log('[DEBUG LOG]:', ...args);
};

const warn = (...args: unknown[]) => {
  if (!import.meta.env.DEV) return;

  console.warn('[DEBUG WARN]:', ...args);
};

export const debug = {
  log,
  warn,
};
