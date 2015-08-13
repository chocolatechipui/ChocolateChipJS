/// <reference path='../typings/tsd.d.ts' />
/// <reference path='core.ts' />
/// <reference path='cache.ts' />
(($) => {
  chocolatechipjs.fn.extend({
    data : function ( key: string, value?: number | string ): string | ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var id;
      var ctx = this[0];
      id = ctx.id;
      if (key === 'undefined' || key === null) {
        return;
      }
      if (value || value === 0) {
        var val = value;
        if (!ctx.id) {
          ++$.uuid;
          id = $.makeUuid();
          ctx.setAttribute("id", id);
          $.chch_cache.data[id] = {};
          $.chch_cache.data[id][key] = val;
        } else {
          id = ctx.id;
          if (!$.chch_cache.data[id]) {
            $.chch_cache.data[id] = {};
            $.chch_cache.data[id][key] = val;
          } else {
            $.chch_cache.data[id][key] = val;
          }
        }
      } else {
        if (key && id) {
          if (!$.chch_cache.data[id]) return;
          if ($.chch_cache.data[id][key] === 0) return $.chch_cache.data[id][key];
          if (!$.chch_cache.data[id][key]) return;
          return $.chch_cache.data[id][key];
        }
      }
     return this;
    },
    
    dataset : function ( key: string, value?: string ): any {
      if (!this.length) return <ChocolateChipElementArray>[];
      if(!document.body.dataset) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      if (typeof value === 'string' && value.length >= 0) {
        this.each((node) => {
          node.dataset[key] = value;
          ret.push(node);
        });
      } else {
        return this[0].dataset[$.camelize(key)];
      }
      return $['returnResult'](ret)
    },
    
    removeData : function ( key: string ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      this.each((ctx) => {
        var id = ctx.getAttribute('id');
        if (!id) {
          return;
        }
        if (!$.chch_cache.data[ctx.id]) {
          return this;
        }
        if (!key) {
          delete $.chch_cache.data[id];
          return this;
        }
        if (Object.keys($.chch_cache.data[id]).length === 0) {
          delete $.chch_cache.data[id];
        } else {
          delete $.chch_cache.data[id][key];
        }
        return this;
      });
    }
  });
})(chocolatechipjs);