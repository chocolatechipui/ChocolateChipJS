/// <reference path='../typings/tsd.d.ts' />
/// <reference path='core.ts' />
(function($){
  $.extend({

    templates : {},

    template : function ( tmpl: string, variable: string ): Function {
      var regex, delimiterOpen, delimiterClosed;
      variable = variable ? variable : 'data';
      regex = /\[\[=([\s\S]+?)\]\]/g;
      delimiterOpen = '[[';
      delimiterClosed = ']]';
      var template =  new Function(variable,
        "var p=[];" + "p.push('" + tmpl
        .replace(/[\r\t\n]/g, " ")
        .split("'").join("\\'")
        .replace(regex,"',$1,'")
        .split(delimiterOpen).join("');")
        .split(delimiterClosed).join("p.push('") + "');" +
        "return p.join('');");
      return template;
    }

  });

  $.template.data = {};

  $.template.index = 0;

  $.template.repeater = function ( element?: any, tmpl?: string, data?: any): any {
   if (!element) {
     var repeaters = $('[data-repeater]');
     $.template.index = 0;
     repeaters.forEach(function(repeater) {
       var template = repeater.innerHTML;
       var r = $(repeater);
       var d = r.attr('data-repeater');
       if (!d || !$.template.data[d]) {
         console.error("No matching data for template. Check your data assignment on $['template'].data or the template's data-repeater value.");
         return;
       }
       r.empty();
       r.removeClass('cloak');
       var t = $.template(template);
       $.template.data[d].forEach(function(item) {
         r.append(t(item));
         $.template.index += 1;
       });
       delete $.template.data[d];
     });
   } else {
     // Exit if data is not repeatable:
     if (!$.isArray(data)) {
         console.error("$.template.repeater() requires data of type Array.");
         return "$.template.repeater() requires data of type Array.";
     } else {
         var template = $.template(tmpl);
       if ($.isArray(data)) {
         data.forEach(function(item) {
           $(element).append(template(item));
         });
       }
     }
   }
  };
})(chocolatechipjs);
