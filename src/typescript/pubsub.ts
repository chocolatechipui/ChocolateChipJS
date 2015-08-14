/// <reference path="../typings/chocolatechipjs/chocolatechipjs.d.ts"/> />
/// <reference path='core.ts' />
(($: ChocolateChipStatic) => {
  $.extend({

    subscriptions: {},

    subscribe: ( topic: string, callback: Function ) => {
      var token = ($['uuidNum']());
      if (!$['subscriptions'][topic]) {
        $['subscriptions'][topic] = [];
      }
      $['subscriptions'][topic].push({
        token: token,
        callback: callback
      });
      return token;
    },

    publish: ( topic: string, args: any ) => {
      if (!$['subscriptions'][topic]) {
        return false;
      }
      setTimeout(() => {
        var len = $['subscriptions'][topic] ? $['subscriptions'][topic].length : 0;
        while (len--) {
           $['subscriptions'][topic][len].callback(topic, args);
        }
        return true;
      });
    },

    unsubscribe: ( token: any ) => {
      setTimeout(function() {
        for (var m in $['subscriptions']) {
          if ($['subscriptions'][m]) {
             for (var i = 0, len = $['subscriptions'][m].length; i < len; i++) {
                if ($['subscriptions'][m][i].token === token) {
                  $['subscriptions'][m].splice(i, 1);
                  return token;
                }
             }
          }
        }
        return false;
      });
    }

  });
})(<any>chocolatechipjs);
