export function mockConsole(
  testCase: (console: jest.Mocked<Console>) => any,
  mock = {},
) {
  function restoreConsole() {
    global.console = originalConsole;
  }

  const originalConsole = global.console;

  const defaults = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  global.console = {
    ...defaults,
    ...mock,
  } as any;

  let result;
  try {
    result = testCase(global.console as jest.Mocked<Console>);
  } catch (e) {
    restoreConsole();
    throw e;
  }

  if (result && typeof result.then === 'function') {
    return result.then(restoreConsole).catch((e: unknown) => {
      restoreConsole();
      throw e;
    });
  } else {
    restoreConsole();
    return result;
  }
}
