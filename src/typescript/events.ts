/// <reference path='../typings/tsd.d.ts' />
/// <reference path='core.ts' />
(($: ChocolateChipStatic) => {
  $.fn.extend({
      bind : function ( event: string, callback: Function, capturePhase?: boolean ): ChocolateChipElementArray {
        if (!this.length) return <ChocolateChipElementArray>[];
        capturePhase = capturePhase || false;
        this.each((ctx) => {
          $.chch_cache.events.set(ctx, event, callback, capturePhase);
        });
        return this;
      },

      unbind : function ( event: string, callback: Function, capturePhase?: boolean ): ChocolateChipElementArray {
        if (!this.length) return <ChocolateChipElementArray>[];
        var id;
        this.each((ctx) => {
          if (!ctx.id || !$.chch_cache.events.hasKey(ctx.id)) {
            return this;
          }
          capturePhase = capturePhase || false;
          id = ctx.getAttribute('id');
          $.chch_cache.events._delete(id, event, callback, capturePhase);
        });
        return this;
      },

      delegate: function ( selector, event, callback, capturePhase ): any {
        if (!this.length) return [];
        capturePhase = capturePhase || false;
        this.each((ctx) => {
          ctx.addEventListener(event, (e) => {
            var target = e.target;
            if (e.target.nodeType === 3) {
              target = e.target.parentNode;
            }
            $(selector, ctx).each((element) => {
              if (element === target) {
                callback.call(element, e);
              } else {
                try {
                  var ancestor = $(target).ancestor(selector);
                  if (element === ancestor[0]) {
                    callback.call(element, e);
                  }
                } catch (err) { }
              }
            });
          }, capturePhase);
        });
      },

      undelegate : function ( selector: any, event: string, callback: Function, capturePhase?: boolean ): any {
        if (!this.length) return <ChocolateChipElementArray>[];
        this.each((ctx) => $(ctx).unbind(event, <any>callback, capturePhase));
      },

      on : function ( event: any, selector: any, callback: any, capturePhase?: boolean ): ChocolateChipElementArray {
        if (!this.length) return <ChocolateChipElementArray>[];
        // If an object literal of events:functions are passed,
        // map them to event listeners on the element:
        if (! selector && /Object/img.test(event.constructor.toString())) {
          this.each((ctx) => {
            for (var key  in event) {
              if (event.hasOwnProperty(key)) {
                $(ctx).on(key, event[key]);
              }
            }
          });
        }
        var ret = [];
        // Check to see if event is a spaced separated list:
        var events;
        if (typeof event === 'string') {
          event = event.trim();
          if (/\s/.test(event)) {
            events = event.split(' ');
            if (events.length) {
              this.each((ctx) => {
                events.each(function(evt) {
                  if (typeof selector === 'function') {
                    $(ctx).bind(evt, selector, callback);
                    ret.push(ctx);
                  } else {
                    $(ctx).delegate(selector, evt, callback, capturePhase);
                    ret.push(ctx);
                  }
                });
              });
            }
          }
        }
        this.each((ctx) => {
          if (typeof selector === 'function') {
            $(ctx).bind(event, selector, callback);
            ret.push(ctx);
          } else {
            $(ctx).delegate(selector, event, callback, capturePhase);
            ret.push(ctx);
          }
        });
        return ret.length ? ret : this;
      },

      off : function ( event, selector, callback, capturePhase ): ChocolateChipElementArray {
        if (!this.length) return <ChocolateChipElementArray>[];
        var ret = [];
        this.each((ctx) => {
          if (typeof selector === 'function' || !selector) {
            $(ctx).unbind(event, selector, callback);
            ret.push(ctx);
          } else {
            $(ctx).undelegate(selector, event, callback, capturePhase);
            ret.push(ctx);
          }
        });
        return ret.length ? ret : this;
      },

      trigger : function ( event ): ChocolateChipElementArray {
        if (!this.length) return <ChocolateChipElementArray>[];
        this.each((ctx) => {
          if( document.createEvent ) {
            var evtObj = document.createEvent('Events');
            evtObj.initEvent(event, true, false);
            ctx.dispatchEvent(evtObj);
          }
        });
      }
  });
})(<any>chocolatechipjs);
