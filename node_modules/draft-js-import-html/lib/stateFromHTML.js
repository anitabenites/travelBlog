'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stateFromHTML;

var _draftJsImportElement = require('draft-js-import-element');

var _parseHTML = require('./parseHTML');

var _parseHTML2 = _interopRequireDefault(_parseHTML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function stateFromHTML(html, options) {
  var _ref = options || {},
      parser = _ref.parser,
      otherOptions = _objectWithoutProperties(_ref, ['parser']);

  if (parser == null) {
    parser = _parseHTML2.default;
  }
  var element = parser(html);
  return (0, _draftJsImportElement.stateFromElement)(element, otherOptions);
}