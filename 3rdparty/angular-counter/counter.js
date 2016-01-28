/**
  @toc

@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!
@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'

@usage

| Attribute              | Default | Description                                                       |
| ---------------------- | ------- | ----------------------------------------------------------------- |
| min/data-min           | null    | A minimum value, never to go below.                               |
| max/data-min           | null    | A maximum value, never to go above.                               |
| step/data-step         | 1       | How much to increment/decrement by.                               |
| addclass/data-addclass | null    | Add a class to the container.                                     |
| width/data-width       | null    | Set the width of the input field.                                 |
| editable/data-editable | false   | Whether the field is readyonly or not. By default, it's readonly. |

partial / html:
<div fs-counter value="someValue"
    data-min="0"
    data-max="100"
    data-step="1"
    data-addclass="someClass"
    data-width="130px"
    data-editable
    ></div>

//end: usage
*/

'use strict';

angular.module('Firestitch.angular-counter', []).directive('fsCounter', ['$timeout', function ($timeout) {

    return {
        restrict: "A",
        scope: {
            value: "=value"
        },
        template: "<div class=\"fs-counter input-group\" ng-class=\"addclass\" ng-style=\"width\"><span class=\"input-group-btn\" ng-click=\"minus()\"><button class=\"btn btn-default\"><span class=\"glyphicon glyphicon-minus\"></span></button></span><input type=\"text\" class=\"form-control text-center\" ng-model=\"value\" ng-blur=\"blurred()\" ng-change=\"changed()\" ng-readonly=\"readonly\"><span class=\"input-group-btn\" ng-click=\"plus()\"><button class=\"btn btn-default\"><span class=\"glyphicon glyphicon-plus\"></span></button></span></div>",
        replace: true,
        link: function(scope, element, attrs) {
            var min = (angular.isUndefined(attrs.min) ? void 0 : parseInt(attrs.min)),
                max = (angular.isUndefined(attrs.max) ? void 0 : parseInt(attrs.max)),
                step = (angular.isUndefined(attrs.step) || parseInt(attrs.step) === 0 ? 1 : parseInt(attrs.step)),
                setValue,
                changeDelay;

            /**
             * Sets the value as an integer. If the value cannot be parsed,
             * i.e. returns NaN, then the min value or 0 will be used instead.
             */
            setValue = function(val) {
                var parsedVal = parseInt(val);
                if (!isNaN(parsedVal)) {
                    if (min !== undefined && min > parsedVal) {
                        parsedVal = min;
                        return parsedVal;
                    }
                    if (max !== undefined && max < parsedVal) {
                        parsedVal = max;
                        return parsedVal;
                    }
                    return parsedVal;
                } else {
                    console.log("parsedValue must parse to a number.");
                    parsedVal = min || 0;
                    return parsedVal;
                }
            };

            /**
             * Confirm the value attribute exists on the element
             */
            if (angular.isUndefined(scope.value)) {
                throw "Missing the value attribute on the counter directive.";
            }

            /**
             * Set some scope wide properties
             */
            scope.readonly = (angular.isUndefined(attrs.editable) ? true : false);
            scope.addclass = (angular.isUndefined(attrs.addclass) ? null : attrs.addclass);
            scope.width = (angular.isUndefined(attrs.width) ? {} : {width:attrs.width});
            scope.value = setValue(scope.value);

            /**
             * Decrement the value and make sure we stay within the limits, if defined.
             */
            scope.minus = function() {
                scope.value = setValue(scope.value - step);
            };

            /**
             * Increment the value and make sure we stay within the limits, if defined.
             */
            scope.plus = function() {
                scope.value = setValue(scope.value + step);
            };

            /**
             * This is only triggered 1 second after a field is manually edited
             * by the user. Where we can perform some validation and make sure
             * that they enter the correct values from within the restrictions.
             */
            scope.changed = function() {
                changeDelay = $timeout(function (){
                    scope.value =  setValue(scope.value);
                }, 1000, true);
            };

            /**
             * This is only triggered when user leaves a manually edited field.
             * Where we can perform some validation and make sure that they
             * enter the correct values from within the restrictions.
             */
            scope.blurred = function() {
                scope.value =  setValue(scope.value);
            };
        }
    };
}]);
