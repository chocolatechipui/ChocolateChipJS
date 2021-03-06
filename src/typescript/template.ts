/// <reference path='../typings/tsd.d.ts' />
/// <reference path='core.ts' />
(($: ChocolateChipStatic) => {
  $.extend({

    templates: {},

    template: ( tmpl: string, variable: string ): Function => {
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

  $.template.repeater = ( element?: any, tmpl?: string, data?: any): any => {
   if (!element) {
     var repeaters = $('[data-repeater]');
     $.template.index = 0;
     var re = /data-src/img
     repeaters.forEach((repeater) => {
       var template = repeater.innerHTML;
       template = template.replace(re, 'src');
       var r = $(repeater);
       var d = r.attr('data-repeater');
       if (!d || !$.template.data[d]) {
         console.error("No matching data for template. Check your data assignment on $['template'].data or the template's data-repeater value.");
         return;
       }
       r.empty();
       r.removeClass('cloak');
       var t = $.template(template);
       $.template.data[d].forEach((item) => {
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
         data.forEach((item) => $(element).append(template(item)));
       }
     }
   }
  };
})(<any>chocolatechipjs);
