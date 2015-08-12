/// <reference path='../typings/tsd.d.ts' />
function chocolatechipjs <ChocolateChipStatic>( selector?:Document|Function|any, context?:any ) {
  var idRE = /^#([\w-]*)$/;
  var classRE = /^\.([\w-]+)$/;
  var tagRE = /^[\w-]+$/;
  var slice = (elements: NodeList) => [].slice.apply(elements);
  var getId = (selector: string): Array<any> => {
    var el =  document.getElementById(selector.split('#')[1]);
    return el ? [el] : [];
  };

  var getTag = (selector: string, context?: HTMLElement): Array<any> => {
    if (context) {
      return slice(context.getElementsByTagName(selector));
    } else {
      return slice(document.getElementsByTagName(selector));
    }
  };

  var getClass = (selector: string, context?: HTMLElement): Array<any> => {
    if (context) {
      return slice(context.getElementsByClassName(selector.split('.')[1]));
    } else {
      return slice(document.getElementsByClassName(selector.split('.')[1]));
    }
  };

  var getNode = (selector:any, context?: HTMLElement): Array<any> => {
    if (typeof selector === 'string') selector = selector.trim();
    if (typeof selector === 'string' && idRE.test(selector)) {
      return getId(selector);
    }
    if (selector && (selector instanceof Array) && selector.length) return selector;
    if (!context && typeof selector === 'string') {
      if (/<\/?[^>]+>/.test(selector)) {
        return this.make(selector);
      }
      if (tagRE.test(selector)) {
        return getTag(selector);
      } else if (classRE.test(selector)) {
        return getClass(selector);
      } else {
        return slice(document.querySelectorAll(selector));
      }
    } else {
      if (context) {
        return slice(context.querySelectorAll(selector));
      } else {
        return slice(document.querySelectorAll(selector));
      }
    }
  };

  if (typeof selector === 'undefined' || selector === document) {
    return <any>[document];
  }
  if (selector === null) {
    return <ChocolateChipElementArray>[];
  }
  if (!!context) {
    if (typeof context === 'string') {
      return slice(document.querySelectorAll(context + ' ' + selector));
    } else if (context.nodeType === 1) {
      return getNode(selector, context);
    }
  } else if (typeof selector === 'function') {
    if (document.getElementsByTagName('body')[0]) {
        selector.call(selector);
    } else {
      document.addEventListener("DOMContentLoaded", function() {
        return selector.call(selector);
      });
    }
  } else if (selector && selector.nodeType === 1) {
    return <ChocolateChipElementArray>[selector];
  } else if (typeof selector === 'string') {
    if (selector === '') return <ChocolateChipElementArray>[];
    if (/<\/?[^>]+>/.test(selector)) {
      return chocolatechipjs['make'](selector);
    } else {
      try {
        return getNode(selector) ? getNode(selector) : [];
      } catch(err) {
        return <ChocolateChipElementArray>[];
      }
    }
  } else if (selector instanceof Array) {
    return selector;
  } else if (/NodeListConstructor/i.test(selector.constructor.toString())) {
    return slice(selector);
  } else if (selector === window) {
    return <ChocolateChipElementArray>[];
  }

  return this;
}

module chocolatechipjs {
  export var extend = ( obj: Object, prop?: Object, enumerable?: boolean ): ChocolateChipStatic => {
    enumerable = enumerable || false;
    if (!prop) {
      prop = obj;
      obj = chocolatechipjs;
    }
    Object.keys(prop).forEach((p) => {
      if (prop.hasOwnProperty(p)) {
        Object.defineProperty(obj, p, {
          value: prop[p],
          writable: true,
          enumerable: enumerable,
          configurable: true
        });
      }
    });
    return <any>chocolatechipjs;
  };
  export var fn = {
    extend : ( object ): ChocolateChipStatic => {
      return chocolatechipjs.extend(Array.prototype, object);
    }
  }
}
window.chocolatechipjs = <any>chocolatechipjs;
if (typeof window.$ === 'undefined') {
  window.$ = <any>chocolatechipjs;
}
