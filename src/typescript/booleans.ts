/// <reference path='../typings/tsd.d.ts' />
/// <reference path='core.ts' />
(($: ChocolateChipStatic) => {
  $.extend({
    isString: ( str: any ): boolean => {
      return typeof str === 'string';
    },

    isArray: (array: any): boolean => {
      return Array.isArray( array );
    },

    isFunction: (func: any): boolean => {
      return Object.prototype.toString.call(func) === '[object Function]';
    },

    isObject: (obj: any): boolean => {
      return Object.prototype.toString.call(obj) === '[object Object]';
    },

    isEmptyObject: (obj: any): boolean => {
        return Object.keys(obj).length === 0;
    },

    isNumber: (number: any): boolean => {
      return typeof number === 'number';
    },

    isInteger: (number: any): boolean => {
      return (typeof number === 'number' && number % 1 === 0);
    },

    isFloat: (number: any): boolean => {
      return (typeof number === 'number' && number % 1 !== 0);
    }
  });
})(<any>chocolatechipjs);
