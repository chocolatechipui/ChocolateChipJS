/// <reference path='../typings/tsd.d.ts' />
/// <reference path='core.ts' />
(($) => {
  var slice = <T>(elements: T) => [].slice.apply(elements);

  $.fn.extend({

    each: function ( callback: Function, ctx: any ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      if (typeof callback !== "function") { return; }
      var i;
      var l = this.length;
      ctx = arguments[1];
      for (i = 0; i < l; i++) {
        if (i in this) {
          if (this.hasOwnProperty(i)) {
            callback.call(ctx, this[i], i, this);
          }
        }
      }
      return this;
    },

    unique: function ( ): any[] {
      var ret = [];
      var sort = this.sort();
      sort.forEach((ctx, idx) => {
        if (ret.indexOf(ctx) === -1) {
          ret.push(ctx);
        }
      });
      ret.sort((a, b) => a - b);
      return ret.length ? ret : [];
    },

    find: function ( selector: string, context?: any ): ChocolateChipElementArray {
      var ret = <ChocolateChipElementArray>[];
      if (!this.length) return ret;
      if (context) {
        $(context).forEach(() => {
          slice(context.querySelectorAll(selector)).forEach((node) => ret.push(node));
        });
      } else {
        $(this).forEach((ctx) => {
          if (ctx.children && ctx.children.length) {
            slice(ctx.querySelectorAll(selector)).forEach((node) => ret.push(node));
          }
        });
      }
      return ret;
    },

    eq: function ( index?: number ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      index = Number(index);
      if (this.length < index + 1) {
        return <ChocolateChipElementArray>[];
      }
      if (index < 0) {
        if (this[this.length + index]) {
          return <ChocolateChipElementArray>[this[this.length + index]];
        } else {
          return <ChocolateChipElementArray>[];
        }
      }
      if (index === 0 || !!index) {
        return <ChocolateChipElementArray>[this[index]];
      } else {
        return <ChocolateChipElementArray>[];
      }
    },

    index: function ( element?: any ): any {
      if (!this.length) return undefined;
      var $this;
      if (!element) {
        $this = $(this[0]);
        return $this.parent().children().indexOf($this[0]);
      } else {
        if (element instanceof Array) {
          return this.indexOf(element[0]);
        } else if (element.nodeType === 1) {
          return this.indexOf(element);
        } else {
          return this.indexOf(element);
        }
      }
    },

    is: function ( arg: any ): ChocolateChipElementArray {
      if (!this.length || !arg) return <ChocolateChipElementArray>[];
      if (!this.length) return <ChocolateChipElementArray>[];
      var items = <ChocolateChipElementArray>[];
      var $this;
      var __is = function ( node, arg ) {
        $this = this;
        if (typeof arg === 'string') {
          if (slice(node.parentNode.querySelectorAll(arg)).indexOf(node) >= 0) {
            return node;
          }
        } else if (typeof arg === 'function') {
          if (arg.call($this)) {
            return node;
          }
        } else if (arg && arg.length) {
          if (this.slice.apply(arg).indexOf(node) !== -1) {
            return node;
          }
        } else if (arg.nodeType === 1) {
          if (node === arg) {
            return node;
          }
        } else {
          return <ChocolateChipElementArray>[];
        }
      };
      this.each(function(item) {
        if (__is(item, arg)) {
          items.push(item);
        }
      });
      if (items.length) {
        return items;
      } else {
        return <ChocolateChipElementArray>[];
      }
    },

    isnt: function ( arg: any ): ChocolateChipElementArray {
    if (!this.length) return <ChocolateChipElementArray>[];
      var items = <ChocolateChipElementArray>[];
      var $this;
      var __isnt = function ( node, arg ) {
        $this = this;
        if (typeof arg === 'string') {
          if (slice(node.parentNode.querySelectorAll(arg)).indexOf(node) === -1) {
            return node;
          }
        } else if (typeof arg === 'function') {
          if (arg.call($this)) {
            return node;
          }
        } else if (arg.length) {
          if (slice(arg).indexOf(node) === -1) {
            return node;
          }
        } else if (arg.nodeType === 1) {
          if (node !== arg) {
            return node;
          }
        } else {
          return <ChocolateChipElementArray>[];
        }
      };
      this.each(function(item) {
        if (__isnt(item, arg)) {
          items.push(item);
        }
      });
      if (items.length) {
        return items;
      } else {
        return <ChocolateChipElementArray>[];
      }
    },

    has: function ( arg: string ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var items = <ChocolateChipElementArray>[];
      var __has = function ( node, arg ) {
        if (typeof arg === 'string') {
          if (node.querySelector(arg)) {
            return node;
          }
        } else if (arg.nodeType === 1) {
          if (slice(this.children).indexOf(arg)) {
            return node;
          }
        } else {
          return false;
        }
      };
      this.each((item) => {
        if (__has(item, arg)) {
          items.push(item);
        }
      });
      if (items.length) {
        return items;
      } else {
        return <ChocolateChipElementArray>[];
      }
    },

    hasnt: function ( arg: HTMLElement | string ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var items = <ChocolateChipElementArray>[];
      this.each((item) => {
        if (typeof arg === 'string') {
          if (!item.querySelector(arg)) {
            items.push(item);
          }
        } else if (arg.nodeType === 1) {
          if (!slice(item.children).indexOf(arg)) {
            items.push(item);
          }
        }
      });
      if (items.length) {
        return items;
      } else {
        return <ChocolateChipElementArray>[];
      }
    },

    prev: function ( ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      this.each((node) => {
        if (node.previousElementSibling) {
          ret.push(node.previousElementSibling);
        }
      });
      return ret;
    },

    next: function ( ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      this.each((node) => {
        if (node.nextElementSibling) {
          ret.push(node.nextElementSibling);
        }
      });
      return ret;
    },

    first: function ( ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      this.each((node) => {
        if (node.firstElementChild) {
          ret.push(node.firstElementChild);
        }
      });
      return ret;
    },

    last: function ( ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      this.each((node) =>{
        if (node.lastElementChild) {
          ret.push(node.lastElementChild);
        }
      });
      return ret;
    },

    before: function ( content: any ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var __before = function ( node, content ) {
        if (typeof content === 'string') {
          content = $['make'](content);
        }
        if (content && content.constructor === Array) {
          var len = content.length;
          var i = 0;
          while (i < len) {
            node.insertAdjacentElement('beforeBegin', content[i]);
            i++;
          }
        } else if (content && content.nodeType === 1) {
          node.insertAdjacentElement('beforeBegin',content);
        }
        return node;
      };

      this.each((node) => __before(node, content));
      return this;
    },

    after: function ( args: any ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var __after = function ( node, content ) {
        var parent = node.parentNode;
        if (typeof content === 'string') {
          content = $['make'](content);
        }
        if (content && content.constructor === Array) {
          var i = 0, len = content.length;
          while (i < len) {
            if (node === parent.lastChild) {
              parent.appendChild(content[i]);
            } else {
              parent.insertBefore(content[i], node.nextSibling);
            }
            i++;
          }
        } else if (content && content.nodeType === 1) {
          parent.appendChild(content);
        }
        return this;
      };

      this.each((node) => __after(node, args));
      return this;
    },

    children: function ( selector?: string ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      if (!selector) {
        this.each((node) => {
          slice(node.children).forEach((ctx) => ret.push(ctx));
        });
      } else {
        this.forEach((node) => {
          slice(node.children).forEach((ctx) => {
          if ($(ctx).is(selector)[0]) {
            ret.push(ctx);
          }
          });
        });
      }
      return ret;
    },

    siblings: function ( selector?: string | boolean ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var _siblings;
      var ret = <ChocolateChipElementArray>[];
      if (selector && (typeof selector === 'string')) {
        selector = selector;
      } else {
        selector = false;
      }
      this.each((ctx) => {
        _siblings = $(ctx).parent().children();
        _siblings.splice(_siblings.indexOf(ctx),1);
        if (selector) {
          _siblings.each((node) => {
            if ($(node).is(selector)[0]) {
              ret.push(node);
            }
          });
        } else {
          _siblings.each((node) => ret.push(node));
        }
      });
      return ret.length ? ret['unique']() : this;
    },

    parent: function ( ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      this.each((ctx) => ret.push(ctx.parentNode));
      ret = ret['unique']();
      return $['returnResult'](ret)
    },

    ancestor: function ( selector: any ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      if (typeof selector === 'undefined') {
        return <ChocolateChipElementArray>[];
      }
      var el = this[0];
      var position = null;
      var p = el.parentNode;
      if (!p) {
        return <ChocolateChipElementArray>[];
      }
      if (typeof selector === 'string') {
        selector.trim();
      }
      if (typeof selector === 'number') {
        position = selector || 1;
         for (var i = 1; i < position; i++) {
           if (p.nodeName === 'HTML') {
             return p;
           } else {
             if (p !== null) {
               p = p.parentNode;
             }
           }
         }
         ret.push(p);
      } else if (typeof selector === 'string') {
        if ($(p).is(selector).length) {
          ret.push(p);
        } else {
          ret.push($(p).ancestor(selector)[0]);
        }
      }
      return ret;
    },

    closest: function ( selector: any ): ChocolateChipElementArray {
      return this.ancestor(selector);
    },

    insert: function ( content: any, position?: any ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var __insert = function (node, content, position) {
        if (node instanceof Array) {
          node = node[0];
        }
        var c = [];
        if (typeof content === 'string') {
          c = $['make'](content);
        } else if (content && content.nodeType === 1) {
          c.push(content);
        } else if (content instanceof Array) {
          c = content;
        }
        var i = 0;
        var len = c.length;
        if (!position || position > (node.children.length + 1) || position === 'last') {
          while (i < len) {
            node.appendChild(c[i]);
            i++;
          }
        } else if (position === 1 || position === 'first') {
          if (node.children) {
            if (node.firstElementChild) {
              while (i < len) {
                node.insertBefore(c[i], node.firstChild);
                i++;
              }
            } else {
              while (i < len) {
                node.insertBefore(c[i], node.firstChild);
                i++;
              }
            }
          }
        } else {
          while (i < len) {
            node.insertBefore(c[i], node.childNodes[position]);
              i++;
          }
        }
        return node;
      };
      var cnt = content;
      if (typeof cnt === 'string') {
        this.each((node) => __insert(node, content, position));
      } else if (cnt instanceof Array) {
        this.each((node, idx) => {
          if (position === 1 || position === 'first') {
            cnt = cnt.reverse();
          }
          cnt.each((n, i) => __insert(node, n, position));
        });
      } else if (cnt.nodeType === 1) {
        this.each((node) => __insert(node, cnt, position));
      }
      return this;
    },

    prepend: function ( content: any ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      this.insert(content,'first');
      return this;
    },

    append: function ( content: ChocolateChipElementArray|HTMLElement|Text|string ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      this.insert(content, 'last');
      return this;
    },

    prependTo: function ( selector: any ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      this.reverse();
      this.each((item) => $(selector)[0].insertBefore(item, $(selector)[0].firstChild));
      return this;
    },

    appendTo: function ( selector: any ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      this.each((item) => $(selector).append(item));
      return this;
    },

    remove: function ( ): ChocolateChipElementArray {
        if (!this.length) return <any>[];
        this.each((ctx) => {
            $(ctx).unbind();
            $(ctx).removeData();
            ctx.parentNode.removeChild(ctx);
        });
    },

    wrap: function ( string: string ) {
        if (!this.length) return <ChocolateChipElementArray>[];
        this.each((ctx) => {
            var tempNode = $.make(string);
            tempNode = tempNode[0];
            var whichClone = $(ctx).clone(true);
            $(tempNode).append(whichClone);
            ctx.parentNode.insertBefore(tempNode, ctx.nextSibling);
            $(ctx).remove(ctx);
        });
    },

    unwrap: function ( ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var parentNode = null;
      this.each((node) => {
        if (node.parentNode === parentNode) {
          return;
        }
        parentNode = node.parentNode;
        if (node.parentNode.nodeName === 'BODY') {
          return false;
        }
        $['replace'](node, node.parentNode);
      });
      return this;
    },

    clone: function ( value?: boolean ): ChocolateChipElementArray {
      if (!this.length) return <any>[];
      var ret = <ChocolateChipElementArray>[];
      this.each((ctx) => {
        if (value === true || !value) {
          ret.push(ctx.cloneNode(true));
        } else {
          ret.push(ctx.cloneNode(false));
        }
      });
      return $['returnResult'](ret)
    },

    css: function ( property: any, value?: string ): string | ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      if (!property) return <ChocolateChipElementArray>[];
      if (!value && property instanceof Object) {
        if (!this.length) return;
        this.forEach((node) => {
          for (var key in property) {
            if (property.hasOwnProperty(key)) {
              node.style[$['camelize'](key)] = property[key];
            }
          }
          ret.push(node);
        });
      } else if (!value && typeof property === 'string') {
        if (!this.length) return;
        return document.defaultView.getComputedStyle(this[0], null).getPropertyValue(property.toLowerCase());
      } else if (!!value) {
        if (!this.length) return <ChocolateChipElementArray>[];
        this.forEach(function(node) {
          node.style[$['camelize'](property)] = value;
          ret.push(node);
        });
      }
      return $['returnResult'](ret)
    },

    width: function ( ): number {
      if (!this.length) return;
      return this.eq(0)[0].clientWidth;
    },

    height: function ( ): number {
      if (!this.length) return;
      return this.eq(0)[0].clientHeight;
    },

    offset: function ( ): Object {
      if (!this.length) return;
      var offset = this.eq(0)[0].getBoundingClientRect();
      return {
        top: Math.round(offset.top),
        left: Math.round(offset.left),
        bottom: Math.round(offset.bottom),
        right: Math.round(offset.right)
       };
    },

    empty: function ( ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      this.each(function(ctx) {
        $(ctx).unbind();
        ctx.textContent = '';
        ret.push(ctx);
      });
      return $['returnResult'](ret)
    },

    html: function ( content: string ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      var __html = function ( node, content ) {
        if (content === '') {
          node.innerHTML = '';
          ret.push(node);
        } else if (content) {
          node.innerHTML = content;
          ret.push(node);
        } else if (!content) {
          ret = node.innerHTML;
        }
      };
      this.each(function(node) {
        __html(node, content);
      });
      return $['returnResult'](ret)
    },

    text: function ( string?: string ): any {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = '';

      var __text = function ( node: HTMLElement, value?: any ): any {
        if (!!value || value === 0) {
          node.innerText = value;
          return node;
        } else {
          return node.innerText;
        }
      };

      this.each(function(node: HTMLElement) {
        if (string) {
          __text(node, string);
        } else {
          ret += __text(node);
        }
      });
      if (!string) {
        return ret;
      }
      return this;
    },

    val: function ( value?: string ): ChocolateChipElementArray | string {
      if (!this.length) return <ChocolateChipElementArray>[];
      if (typeof value === 'string') {
        this[0].value = value;
        return this;
      } else {
        if (this[0] && this[0].value) {
          return this[0].value;
        } else {
          return;
        }
      }
    },

    prop: function ( property: string, value?: string | number ) {
      if (!this.length) return <ChocolateChipElementArray>[];
      return this.attr(property, value);
    },

    addClass: function ( className: string ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      if (typeof className !== "string") return;
      var ret = <ChocolateChipElementArray>[];
      var classes;
      this.each(function(node) {
        if (/\s/.test(className)) {
          classes = className.split(' ');
          classes.each(function(name) {
            node.classList.add(name);
          });
        } else {
          node.classList.add(className);
        }
        ret.push(node);
      });
      return $['returnResult'](ret);
    },

    hasClass: function ( className: string ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      var tokens = <any>[];
      if (/\s/.test(className)) {
        tokens = className.split(' ');
      }
      this.each(function(node) {
        if (tokens.length) {
          tokens.forEach(function(name) {
            if (node && node.classList && node.classList.contains(name)) {
              ret.push(node);
            }
          });
          ret = ret['unique']();
        } else if (node && node.classList && node.classList.contains(className)) {
          ret.push(node);
        }
      });
      return $['returnResult'](ret)
    },

    removeClass: function ( className: string ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      var classes;
      this.each(function(node) {
        if (!node) return;
        if (/\s/.test(className)) {
          classes = className.split(' ');
          classes.each(function(name) {
            node.classList.remove(name);
          });
        } else {
          node.classList.remove(className);
        }
        if (node.getAttribute('class')==='') {
          node.removeAttribute('class');
        }
        ret.push(node);
      });
      return $['returnResult'](ret);
    },

    toggleClass: function ( className: string ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      this.each(function(node) {
        node.classList.toggle(className);
        ret.push(node);
      });
      return $['returnResult'](ret)
    },
    
    attr: function ( property: string, value?: string ): string | ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      var __attr = function ( node, property, value ) {
         if (!value) {
           return node.getAttribute(property);
         } else {
           return node.setAttribute(property, value);
         }
      };
      if (!value) {
        if (this[0].hasAttribute(property)) {
          return this[0].getAttribute(property);
        }
      } else {
        this.each(function(node) {
          __attr(node, property, value);
          ret.push(node);
        });
      }
      if (ret.length) {
        return ret;
      }
    },

    hasAttr: function ( property: string ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      this.each(function(node) {
        if (node.hasAttribute(property)) {
          ret.push(node);
        }
      });
      return $['returnResult'](ret)
    },

    removeAttr: function ( attribute: string ): ChocolateChipElementArray {
      if (!this.length) return <any>[];
      var ret = <ChocolateChipElementArray>[];
      this.each(function(node) {
        if (!!node.hasAttribute(attribute)) {
          node.removeAttribute(attribute);
          ret.push(node);
        }
      });
      return $['returnResult'](ret)
    },

    disable: function ( ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      this.each(function(node) {
        node.classList.add('disabled');
        node.setAttribute('disabled', true);
        node.style.cursor = 'default';
      });
      return $['returnResult'](ret)
    },

    enable: function ( ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      this.each(function(node) {
        node.classList.remove('disabled');
        node.removeAttribute('disabled');
        node.style.cursor = 'auto';
      });
      return $['returnResult'](ret)
    },

    hide: function ( speed: any, callback?: Function ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var cbk = callback || $['noop'];
      if (!this.length) return <ChocolateChipElementArray>[];
      var ret = <ChocolateChipElementArray>[];
      var css = '';
      var storedDimensions = {};
      var cssAnim = {
        opacity: 0,
        height: 0,
        padding: 0
      };
      var transition = $['isWebkit'] ? '-webkit-transition' : 'transition';
      this.each(function(ctx) {
        storedDimensions['padding'] = $(ctx).css('padding');
        storedDimensions['height'] = $(ctx).css('height');
        storedDimensions['opacity'] = $(ctx).css('opacity');
        storedDimensions['display'] = $(ctx).css('display');
        $(ctx).data('ui-dimensions', storedDimensions);
        if (typeof speed === 'string') {
          if (speed === 'slow') {
            $(ctx).css({transition: 'all 1s ease-out'});
            $(ctx).css(cssAnim);
            setTimeout(function() {
              $(ctx).css({visibility: 'hidden', display: 'none'});
              cbk.apply(ctx, arguments);
            }, 1000);
          } else if (speed === 'fast') {
            $(ctx).css({transition: 'all .35s ease-in-out'});
            $(ctx).css(cssAnim);
            setTimeout(function() {
              $(ctx).css({visibility: 'hidden', display: 'none'});
              cbk.apply(ctx, arguments);
            }, 350);
          }
        } else if (typeof speed === 'number') {
          css = 'all ' + speed + 'ms ease-in-out';
          $(ctx).css({transition: css});
          $(ctx).css(cssAnim);
          setTimeout(function() {
            $(ctx).css({visibility: 'hidden', display: 'none'});
            cbk.apply(ctx, arguments);
          }, speed);
        }
        if (!callback && typeof speed === 'function') {
          $(ctx).css({display: 'none', visibility: 'hidden'});
          speed.apply(ctx, arguments);
        }
        if (!speed) {
          $(ctx).data('','');
          $(ctx).css({
            display: 'none',
            visibility: 'hidden'
          });
        }
        ret.push(ctx);
      });
      return $['returnResult'](ret)
    },

    show: function ( speed: any, callback?: Function ) {
      if (!this.length) return <ChocolateChipElementArray>[];
      var cbk = callback || $['noop'];
      var createCSSAnim = function(opacity, height, padding) {
        return {
          opacity: opacity,
          height: height,
          padding: padding
        };
      };
      var transition = $['isWebkit'] ? '-webkit-transition' : 'transition';
      this.each(function(ctx) {
        var storedDimensions = $(ctx).data('ui-dimensions');
        var height = storedDimensions && storedDimensions['height'] || 'auto';
        var padding = storedDimensions && storedDimensions['padding'] || 'auto';
        var opacity = storedDimensions && storedDimensions['opacity'] || 1;
        var display = storedDimensions && storedDimensions['display'] || 'block';
        if (typeof speed === 'string') {
          if (speed === 'slow') {
            $(ctx).css({visibility: 'visible', display: display});
            setTimeout(function() {
              $(ctx).css({transition: 'all 1s ease-out'});
              $(ctx).css(createCSSAnim(opacity, height, padding));
              setTimeout(function() {
                cbk.apply(ctx, arguments);
              }, 1000);
            });
          } else if (speed === 'fast') {
            $(ctx).css({visibility: 'visible', display: display});
            setTimeout(function() {
              $(ctx).css({transition: 'all .250s ease-out'});
              $(ctx).css(createCSSAnim(opacity, height, padding));
              setTimeout(function() {
                cbk.apply(ctx, arguments);
              }, 250);
            });
          }
        } else if (typeof speed === 'number') {
          $(ctx).css({visibility: 'visible', display: display});
          setTimeout(function() {
            $(ctx).css({transition: 'all ' + speed + 'ms ease-out'});
            $(ctx).css(createCSSAnim(opacity, height, padding));
            setTimeout(function() {
              cbk.apply(ctx, arguments);
            }, speed);
          });
        }
        if (!speed) {
          $(ctx).css({
            display: display,
            visibility: 'visible',
            opacity: opacity
          });
        }
      });
    },

    animate: function ( options: Object, duration?: string, easing?: string ): ChocolateChipElementArray {
      if (!this.length) return <ChocolateChipElementArray>[];
      var onEnd = null;
      duration = duration || '.5s';
      easing = easing || 'linear';
      var css = {};
      var transition;
      var transitionEnd;
      if ('ontransitionend' in window) {
        transition = 'transition';
        transitionEnd = 'transitionend';
      } else {
        transition = '-webkit-transition';
        transitionEnd = 'webkitTransitionEnd';
      }
      css[transition] = 'all ' + duration + ' ' + easing;
      this.forEach(function(ctx) {
        for (var prop in options) {
          if (prop === 'onEnd') {
            onEnd = options[prop];
            $(ctx).bind(transitionEnd, onEnd());
          } else {
            css[prop] = options[prop];
          }
        }
        $(ctx).css(css);
      });
      return this;
    }

  });
})(chocolatechipjs);
