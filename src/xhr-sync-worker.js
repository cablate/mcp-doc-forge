// This is a minimal implementation of a synchronous XMLHttpRequest worker
// It's needed by jsdom for synchronous XHR operations

self.onmessage = function(e) {
  const xhr = new XMLHttpRequest();
  xhr.open(e.data.method, e.data.url, false); // false = synchronous
  
  if (e.data.headers) {
    Object.keys(e.data.headers).forEach(function(key) {
      xhr.setRequestHeader(key, e.data.headers[key]);
    });
  }
  
  try {
    xhr.send(e.data.data || null);
    self.postMessage({
      status: xhr.status,
      statusText: xhr.statusText,
      headers: xhr.getAllResponseHeaders(),
      response: xhr.response
    });
  } catch (error) {
    self.postMessage({
      error: error.message
    });
  }
}; 