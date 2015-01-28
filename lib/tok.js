'use strict';

/**
 * Module dependencies
 */

var regex = require('./regex');

/**
 * Expose `escape`
 */

var esc = module.exports;

var et = esc.et = function et(ch) {
  return esc.escTokens[ch];
};

esc.escape = function escape(str, tok, strip) {
  var to = esc.escTokens[tok];
  var re = regex.escapeRegex[tok];
  return str.replace(re, to);
};

esc.unescape = function unescape(str, toks, strip) {
  var len = toks.length;
  while (len--) {
    var tok = toks[len];
    var from = esc.escTokens[tok];
    var to = esc.unescTokens[from];
    var re = new RegExp(from, 'g');
    str = str.replace(re, strip ? '' : to);
  }
  return str;
};

esc.isEscaped = function isEscaped(str, syntax) {
  var esc = regex.escapeRegex[syntax];
  return esc.test(str);
};

esc.escTokens = {
  '${'  : '__ESC_ES6__',
  '\\*' : '__ESC_STAR__',
  '\\,' : '__ESC_COMMA__',
  '\\..': '__ESC_DOTS__',
  '\\(' : '__ESC_LT_PAREN__',
  '\\)' : '__ESC_RT_PAREN__',
  '\\[' : '__ESC_LT_BRACK__',
  '\\]' : '__ESC_RT_BRACK__',
  '\\{' : '__ESC_LT_BRACE__',
  '\\}' : '__ESC_RT_BRACE__',
};

esc.unescTokens = {
  '__ESC_ES6__'     : '${',
  '__ESC_STAR__'    : '*',
  '__ESC_COMMA__'   : ',',
  '__ESC_DOTS__'    : '..',
  '__ESC_LT_PAREN__': '(',
  '__ESC_RT_PAREN__': ')',
  '__ESC_LT_BRACK__': '[',
  '__ESC_RT_BRACK__': ']',
  '__ESC_LT_BRACE__': '{',
  '__ESC_RT_BRACE__': '}',
};
