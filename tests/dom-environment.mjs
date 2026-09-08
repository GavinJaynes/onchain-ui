import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});

for (const name of [
  "window", "document", "navigator", "HTMLElement", "HTMLInputElement",
  "Node", "Element", "Document", "DocumentFragment", "Event", "MouseEvent",
  "KeyboardEvent", "InputEvent", "MutationObserver",
]) {
  Object.defineProperty(globalThis, name, {
    configurable: true,
    value: name === "window" ? dom.window : dom.window[name],
  });
}
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export { dom };
