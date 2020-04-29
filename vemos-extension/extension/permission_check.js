window.addEventListener("DOMContentLoaded", () => {
  console.log("Setting vemos-version");
  let browser = window.browser || window.chrome;
  window.document.documentElement.setAttribute(
    "vemos-version",
    browser.runtime.getManifest().version
  );
});

window.addEventListener("message", (event) => {
  let browser = window.browser || window.chrome;
  let permissionURL = event.data.permissionURL;
  let request = event.data.request;
  if (permissionURL) {
    browser.runtime.sendMessage({ permissionURL, request }, (response) => {
      console.log("Permission available?", response.result);
      window.postMessage(
        { permissionResult: response.result ? "available" : "unavailable" },
        "*"
      );
    });
  }
});

window.addEventListener("message", (event) => {
  let browser = window.browser || window.chrome;
  let peerId = event.data.setPeerId;
  if (peerId) {
    console.log("Set Peer to ", peerId);
    browser.runtime.sendMessage(
      { setPeerId: peerId, host: event.data.host },
      (response) => {
        console.log("Peer set", response);
        window.postMessage({ peerSet: response }, "*");
      }
    );
  }
});
