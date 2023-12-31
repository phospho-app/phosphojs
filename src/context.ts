import { createContext } from "unctx";

// NOTE: this should work in Deno, Node, and Workers environments. Not on the browser.
import { AsyncLocalStorage } from "node:async_hooks";

const user = createContext({
  asyncContext: true,
  AsyncLocalStorage,
});

export default {
  user,
};
