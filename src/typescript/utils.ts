/// <reference path='../typings/tsd.d.ts' />
/// <reference path='core.ts' />
(function($){
  $.extend($, {

    libraryName : "ChocolateChip",

    version: 'VERSION_NUMBER',

    noop : function (): void {},

    uuidNum : function ( ): string {
      var d = new Date().getTime();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    },

    makeUuid : function ( ): string {
      return "chch_" +  this.uuidNum();
    },

    uuid : 0,

    make: function ( HTMLString: string ): ChocolateChipElementArray[] {
      var ret:any = [];
      var temp:any = document.createElement('div');
      temp.innerHTML = HTMLString;
      temp = [].slice.apply(temp.childNodes);
      temp.forEach(function(ctx) {
        if (ctx.nodeType === 1) {
          ret.push(ctx);
        } else if (ctx.nodeType === 3 && ctx.nodeValue.trim().length !== 0) {
          ret.push(ctx);
        }
      });
      return ret;
    },

    concat : function ( args: any ): string {
      if (args instanceof Array) {
        return args.join('');
      } else if (args instanceof Object) {
        return;
      } else {
        args = [].slice.apply(arguments);
        return String.prototype.concat.apply(args.join(''));
      }
    },

    html : function ( HTMLString: string ): ChocolateChipElementArray {
      return this.make(HTMLString);
    },

    replace : function ( newElem: any, oldElem: any ): any {
      if (!newElem || !oldElem) return;
       newElem = newElem.length ? newElem[0] : newElem;
       oldElem = oldElem.length ? oldElem[0] : oldElem;
       oldElem.parentNode.replaceChild(newElem, oldElem);
       return;
    },

    require : function ( src: string, callback: Function ): void {
      callback = callback || this.noop;
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', src);
      script.setAttribute('defer', 'defer');
      script.onload = function() {
        callback.apply(callback, arguments);
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    },

    delay : function ( func: Function, milliseconds: number = 1 ): void {
      func = func || $.noop;
      setTimeout(function() {
        func.call(func);
      }, milliseconds);
    },

    defer : function ( func: Function ): Function {
      func = func || $.noop;
      return this.delay.apply($, [func, 1].concat([].slice.call(arguments, 1)));
    },

    returnResult: function ( result ): Array<any> {
      if (typeof result === 'string') return <any>[];
      if (result && result.length && result[0] === undefined) return <any>[];
      if (result && result.length) return result;
      else return <any>[];
    },

    each : function ( array, callback ): void {
      if (!array || !$.isArray(array)) return;
      var value;
      var i = 0;
      var length = array.length;
      for ( ; i < length; i++ ) {
        value = callback.call( array[ i ], array[ i ], i );
        if ( value === false ) {
          break;
        }
      }
    }

  });
})(chocolatechipjs);
