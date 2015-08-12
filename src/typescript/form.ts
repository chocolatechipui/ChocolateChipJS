/// <reference path='../typings/chocolatechipjs/chocolatechipjs.d.ts' />
/// <reference path='core.ts' />
(($) => {
  "use strict";
  $.extend($, {  
    serialize: ( element ) => {
      var form;
      var elements;
      if (typeof element === 'string') {
        form = $(element)[0];
      } else if (element && element.nodeName) {
        form = element;
      } else if (element && element[0] && element[0].nodeName) {
        form = element[0];
      } else {
        return;
      }
      elements = [].slice.apply(form.elements);
      var names = '';
      var escaped = '';
      var words;
      var temp;
      var arr = [];
      elements.forEach((input) => {
        if (input.nodeName === 'FIELDSET') return;
        if (!names) {
          names += input.name + '=';
        } else {
          names += ('&' + input .name + '=');
        }
        temp = input.value || '';
        words = temp.split(' ');
        words.forEach((word) => {
          arr.push(encodeURIComponent(word));
        });
        escaped = words.join('+');
        names += escaped;
        escaped = '';
        words = '';
      });
      arr = [];
      return names;
    },
  
    // Convert form values into JSON object:
    form2JSON: ( rootNode, delimiter ): JSON => {
      rootNode = typeof rootNode === 'string' ? $(rootNode)[0] : rootNode;
      delimiter = delimiter || '.';
      var result = {};
      var arrays = {};

      var getFieldValue = (fieldNode) => {
        if (fieldNode.nodeName === 'INPUT') {
          if (fieldNode.type.toLowerCase() === 'radio' || fieldNode.type.toLowerCase() === 'checkbox') {
            if (fieldNode.checked) {
              return fieldNode.value;
            }
          } else {
            if (!fieldNode.type.toLowerCase().match(/button|reset|submit|image/i)) {
              return fieldNode.value;
            }
          }
        } else {
          if (fieldNode.nodeName === 'TEXTAREA') {
            return fieldNode.value;
          } else {
            if (fieldNode.nodeName === 'SELECT') {
              return getSelectedOptionValue(fieldNode);
            }
          }
        }
        return '';
      };
      var getFormValues = (rootNode): HTMLElement[]=> {
        var result = [];
        var currentNode = rootNode.firstChild;
        while (currentNode) {
          if (currentNode.nodeName.match(/INPUT|SELECT|TEXTAREA/i)) {
            result.push({ name: currentNode.name, value: getFieldValue(currentNode) });
          } else {
            var subresult = getFormValues(currentNode);
            result = result.concat(subresult);
          }
          currentNode = currentNode.nextSibling;
        }
        return result;
      };
      var getSelectedOptionValue = (selectNode) => {
        var multiple = selectNode.multiple;
        if (!multiple) {
          return selectNode.value;
        }
        if (selectNode.selectedIndex > -1) {
          var result = [];
          $('option', selectNode).each((item) => {
            if (item.selected) {
              result.push(item.value);
            }
          });
          return result;
        }
      };
      var formValues = getFormValues(rootNode);
      formValues.forEach((item: any) => {
        var value = item.value;
        if (value !== '') {
          var name = item.name;
          var nameParts = name.split(delimiter);
          var currResult = result;
          for (var j = 0; j < nameParts.length; j++) {
            var namePart = nameParts[j];
            var arrName;
            if (namePart.indexOf('[]') > -1 && j === nameParts.length - 1) {
              arrName = namePart.substr(0, namePart.indexOf('['));
              if (!currResult[arrName]) {
                currResult[arrName] = [];
              }
              currResult[arrName].push(value);
            } else {
              if (namePart.indexOf('[') > -1) {
                arrName = namePart.substr(0, namePart.indexOf('['));
                var arrIdx = namePart.replace(/^[a-z]+\[|\]$/gi, '');
                if (!arrays[arrName]) {
                  arrays[arrName] = {};
                }
                if (!currResult[arrName]) {
                  currResult[arrName] = [];
                }
                if (j === nameParts.length - 1) {
                  currResult[arrName].push(value);
                } else {
                  if (!arrays[arrName][arrIdx]) {
                    currResult[arrName].push({});
                    arrays[arrName][arrIdx] = 
                    currResult[arrName][currResult[arrName].length - 1];
                  }
                }
                currResult = arrays[arrName][arrIdx];
              } else {
                if (j < nameParts.length - 1) { 
                  if (!currResult[namePart]) {
                    currResult[namePart] = {};
                  }
                  currResult = currResult[namePart];
                } else {
                  currResult[namePart] = value;
                }
              }
            }
          }
        }
      });
      return <JSON>result;
    }
  });
})(chocolatechipjs);