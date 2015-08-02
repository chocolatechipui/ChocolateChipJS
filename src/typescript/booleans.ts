/// <reference path='../typings/tsd.d.ts' />
/// <reference path='core.ts' />
(function($){
  $.extend({
    isString : function ( str: any ): boolean {
      return typeof str === 'string';
    },

    isArray : function ( array: any ): boolean {
      return Array.isArray( array );
    },

    isFunction : function ( func: any ): boolean {
      return Object.prototype.toString.call(func) === '[object Function]';
    },

    isObject : function ( obj: any ): boolean {
      return Object.prototype.toString.call(obj) === '[object Object]';
    },

    isEmptyObject : function (obj: any): boolean {
        return Object.keys(obj).length === 0;
    },

    isNumber : function ( number: any ): boolean {
      return typeof number === 'number';
    },

    isInteger : function ( number: any ): boolean {
      return (typeof number === 'number' && number % 1 === 0);
    },

    isFloat : function ( number: any ): boolean {
      return (typeof number === 'number' && number % 1 !== 0);
    }
  });
})(chocolatechipjs);
