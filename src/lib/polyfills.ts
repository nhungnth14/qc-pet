// Polyfill DOMException for Hermes (React Native)
if (typeof globalThis.DOMException === 'undefined') {
  // @ts-expect-error — gán polyfill vào globalThis, type lib chưa có DOMException
  globalThis.DOMException = class DOMException extends Error {
    constructor(message?: string, name?: string) {
      super(message);
      this.name = name ?? 'DOMException';
    }
  };
}
