// Transcrypt'ed from Python, 2021-06-08 21:32:00
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = '__main__';
export var awaitImport = async function (selectorValue) {
	var strippedSelectorValue = selectorValue.__getslice__ (1, -(1), 1);
	await import ("http://www.transcrypt.org/live/transcrypt/demos/turtle_demos/__target__/" + strippedSelectorValue + ".js")
};
export var clear = function () {
	editor.setValue ('');
	run ();
};
export var run = function () {
	var success = function (result) {
		// pass;
	};
	var fail = function (a, b, c) {
		print ('Run error:', a, b, c);
	};
};
export var mail = function () {
	var success = function (result) {
		print (result);
	};
	var fail = function (a, b, c) {
		print ('Run error:', a, b, c);
	};
	$.ajax (dict ({'url': 'http://www.transcrypt.org/mail', 'type': 'POST', 'data': JSON.stringify ([document.getElementById ('mail_address').value, editor.getValue ()]), 'dataType': 'json', 'contentType': 'application/json', 'success': success, 'fail': fail}));
};
export var selectExample = function () {
	var py_selector = document.getElementById ('select_example');
	var selectorValue = JSON.stringify (py_selector.options [py_selector.selectedIndex].value);
	var success = function (result) {
		editor.setValue (result [0]);
		awaitImport (selectorValue) .then () .catch ()
	};
	var fail = function (a, b, c) {
		print ('Select example error:', a, b, c);
	};
	$.ajax (dict ({'url': 'http://www.transcrypt.org/example', 'type': 'POST', 'data': selectorValue, 'dataType': 'json', 'contentType': 'application/json', 'success': success, 'fail': fail}));
};
selectExample ();

//# sourceMappingURL=turtle_site.map