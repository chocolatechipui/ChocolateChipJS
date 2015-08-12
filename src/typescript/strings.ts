/// <reference path='../typings/tsd.d.ts' />
/// <reference path='core.ts' />
(($) => {
  $.extend({
    camelize: function ( string: string ): string {
      if (typeof string !== 'string') return;
      return string.replace(/\-(.)/g, function(match, letter){return letter.toUpperCase();});
    },
    
    deCamelize : function ( string: string ): string {
      if (typeof string !== 'string') return;
      return string.replace(/([A-Z])/g, '-$1').toLowerCase();
    },
    
    capitalize : function ( string: string, all?: boolean ): string {
        var $this = this;
      if (!string) {
        return;
      }
      if (typeof string !== 'string') return;
      if (all) {
        var str = string.split(' ');
        var newstr = [];
        str.forEach((item) => newstr.push($this.capitalize(item)));
        return newstr.join(' ');
      } else {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
      }
    },
    
    w : function ( str ): string[] {
      return str.split(' ');
    }
  });
})(chocolatechipjs);