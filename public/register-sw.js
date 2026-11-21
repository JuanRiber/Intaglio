// Registra o service worker (arquivo separado porque a CSP não permite scripts inline)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function (err) {
      console.warn('Service worker não registrado', err);
    });
  });
}
