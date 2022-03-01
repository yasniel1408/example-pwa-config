/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

const config = {
  maxEntries: 100,
  maxAgeSeconds: 60 * 60 * 24 * 30,
};

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(({ request, url }: { request: Request; url: URL }) => {
  if (request.mode !== "navigate") {
    return false;
  }
  if (url.pathname.startsWith("/_")) {
    return false;
  }
  if (url.pathname.match(fileExtensionRegexp)) {
    return false;
  }
  return true;
}, createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`));

// Images
registerRoute(
  ({ url }: { url: URL }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".png"),
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [new ExpirationPlugin(config)],
  })
);

registerRoute(
  ({ url }: { url: URL }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".svg"),
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [new ExpirationPlugin(config)],
  })
);

registerRoute(
  ({ url }: { url: URL }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".jpg"),
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [new ExpirationPlugin(config)],
  })
);

// API
registerRoute(
  /^https?:\/\/training-dev-api.lexawise.com\/zenith\/.*/,
  new StaleWhileRevalidate({
    cacheName: "all-https",
    plugins: [new ExpirationPlugin(config)],
  }),
  "GET"
);

// Default
registerRoute(
  /^https?.*/,
  new NetworkFirst({
    cacheName: "all-https",
    plugins: [new ExpirationPlugin(config)],
  }),
  "GET"
);
registerRoute(
  /^http?.*/,
  new NetworkFirst({
    cacheName: "all-http",
    plugins: [new ExpirationPlugin(config)],
  }),
  "GET"
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
