/// <reference path='../typings/tsd.d.ts' />
/// <reference path='core.ts' />
enum MethodEnum {
  OPTIONS,
  GET,
  HEAD,
  POST,
  PUT,
  DELETE,
  TRACE,
  CONNECT
}

enum ForbiddenMethodEnum {
  CONNECT,
  TRACE,
  TRACK
}

function isForbiddenMethod ( method: ByteString ): boolean {
  if (ForbiddenMethodEnum[method] !== undefined) {
    return true;
  }
  return false;
}

(function(self) {
  'use strict';

  if (self.fetch) {
    return;
  }

  function normalizeName ( name: string ): string {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase();
  }

  function normalizeValue ( value: string ): string {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value;
  }

  function Headers ( headers?: any ): void {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function ( name: string, value: string ): void {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = [];
      this.map[name] = list;
    }
    list.push(value);
  }

  Headers.prototype['delete'] = function ( name: string ): void {
    delete this.map[normalizeName(name)];
  }

  Headers.prototype.get = function ( name: string ): ByteString {
    var values = this.map[normalizeName(name)];
    return values ? values[0] : null;
  }

  Headers.prototype.getAll = function ( name: string ): Array<ByteString>  {
    return this.map[normalizeName(name)] || [];
  }

  Headers.prototype.has = function ( name: string ): boolean {
    return this.map.hasOwnProperty(normalizeName(name));
  }

  Headers.prototype.set = function ( name: string, value: string ): void {
    this.map[normalizeName(name)] = [normalizeValue(value)];
  }

  Headers.prototype.forEach = function(callback: Function, thisArg: any): void {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this);
      }, this)
    }, this)
  }

  function consumed ( body ): any {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady ( reader ): Promise<any> {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      }
      reader.onerror = function() {
        reject(reader.error);
      }
    });
  }

  function readBlobAsArrayBuffer ( blob ): Promise<any> {
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    return fileReaderReady(reader);
  }

  function readBlobAsText ( blob ): Promise<any> {
    var reader = new FileReader();
    reader.readAsText(blob);
    return fileReaderReady(reader);
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true;
      } catch(e) {
        return false;
      }
    })(),
    formData: 'FormData' in self
  }

  function Body(): void {
    this.bodyUsed = false;


    this._initBody = function(body) {
      this._bodyInit = body;
      if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (!body) {
        this._bodyText = '';
      } else {
        throw new Error('unsupported BodyInit type');
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer);
      }

      this.text = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob);
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text');
        } else {
          return Promise.resolve(this._bodyText);
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this);
        return rejected ? rejected : Promise.resolve(this._bodyText);
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode);
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse);
    }

    return this;
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod ( method ): string {
    var uppercased = method.toUpperCase();
    return (methods.indexOf(uppercased) > -1) ? uppercased : method;
  }
  
  function Request ( input, options ): void {
    options = options || {};
    var body = options.body;
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = input;
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  function decode ( body ): FormData {
    var form = new FormData();
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    })
    return form;
  }

  function headers ( xhr ): Headers {
    var head = new Headers();
    var pairs = xhr.getAllResponseHeaders().trim().split('\n');
    pairs.forEach(function(header) {
      var split = header.trim().split(':');
      var key = split.shift().trim();
      var value = split.join(':').trim();
      head.append(key, value);
    })
    return head;
  }

  Body.call(Request.prototype);

  function Response ( bodyInit, options ) {
    if (!options) {
      options = {};
    }

    this._initBody(bodyInit);
    this.type = 'default';
    this.url = null;
    this.status = options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText;
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
    this.url = options.url || '';
  }

  Body.call(Response.prototype);

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function ( input, init ): Promise<any> {
    // TODO: Request constructor should accept input, init
    var request;
    if (Request.prototype.isPrototypeOf(input) && !init) {
      request = input;
    } else {
      request = new Request(input, init);
    }

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL;
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL');
        }
        return;
      }
      // Enable timeout:
      var reqTimeout;
      if (init && init.timeout) {
        reqTimeout = setTimeout(function() {
            reject(new TypeError('Request timed out at: ' + input));
        }, init.timeout);
      }
      xhr.onload = function(): void {
        clearTimeout(reqTimeout);
        var status = (xhr.status === 1223) ? 204 : xhr.status;
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'));
          return;
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        };
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      }

      xhr.onerror = function(): void {
        clearTimeout(reqTimeout);
        reject(new TypeError('Network request failed'));
      }

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }
  self.fetch.polyfill = true;

  /**
   *
   * JSONP with API like fetch.
   */
  $.extend({
    
    // Container for jsonp methods:
    JSONPCallbacks: [],

    // JSONP method:
    jsonp: function ( url, opts ) {
      var settings = {
        timeout: 2000,
        callbackName: 'callback',
        clear: true
      }
      if (opts) {
        $.extend(settings, opts);
      }

      // Method to create callback:
      function generateCallbackName() {
        var base = 'callback';
        var callbackName = settings.callbackName + '_' + ($.JSONPCallbacks.length + 1);
        $.JSONPCallbacks.push(callbackName);
        return callbackName;
      }
      var callbackName = generateCallbackName();
      // Create and return Promise with result from request:
      return new Promise(function(resolve, reject) {
        var timeout;
        window.jsonp = window.jsonp || {};
        window.jsonp[callbackName] = function(response) {
          resolve({
            ok: true,
            json: function() {
              return Promise.resolve(response);
            }
          });
          if (timeout) {
            clearTimeout(timeout);
          }
        };
        // Create script tag:
        var script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=jsonp.' + callbackName;
        document.body.appendChild(script);
        // Delete script tag:
        setTimeout(function() {
          script.parentNode.removeChild(script);
        });
        // Clear JSONP methods from window:
        if (settings.clear) {
          var pos = $.JSONPCallbacks.indexOf(callbackName);
          $.JSONPCallbacks.splice(pos, 1);
        }
        // Handle timeout:
        timeout = setTimeout(function() {
          reject(new Error('JSONP request to ' + url + ' timed out'));
        }, settings.timeout);
      });

    },
    
    // Helper function for fetch Promises.
    // Usage: .then(json)
    json: function ( response ) {
      return response.json();
    }
  });
})(window);
