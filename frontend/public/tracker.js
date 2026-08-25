/*! Signalist tracker v0.1.0 */
(function (window, document) {
  var script = document.currentScript || document.querySelector("script[data-site-id]");
  var siteId = script && script.dataset.siteId;
  var endpoint = (script && script.dataset.endpoint) || "http://localhost:8080/api/v1/events";

  if (!siteId) return;

  function send(type, properties) {
    var payload = JSON.stringify({
      siteId: siteId,
      type: type,
      path: window.location.pathname,
      referrer: document.referrer || null,
      properties: properties || {},
      timestamp: new Date().toISOString()
    });
    if (navigator.sendBeacon) return navigator.sendBeacon(endpoint, new Blob([payload], { type: "application/json" }));
    return fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true });
  }

  window.Signalist = { track: function (name, properties) { return send("event", { name: name, ...properties }); } };
  send("pageview");
})(window, document);
