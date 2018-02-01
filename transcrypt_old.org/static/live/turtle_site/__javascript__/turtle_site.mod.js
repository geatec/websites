	(function () {
		var math = {};
		var random = {};
		var turtle = {};
		__nest__ (turtle, '', __init__ (__world__.turtle));
		__nest__ (random, '', __init__ (__world__.random));
		__nest__ (math, '', __init__ (__world__.math));
		var clear = function () {
			editor.setValue ('');
			turtle.reset ();
			run ();
		};
		var run = function () {
			var success = function (result) {
				turtle.reset ();
				var rnd = random;
				eval (result);
				random = rnd;
			};
			var fail = function (a, b, c) {
				print ('Run error:', a, b, c);
			};
			$.ajax (dict ({'url': 'http://www.transcrypt.org/compile', 'type': 'POST', 'data': JSON.stringify (editor.getValue ()), 'dataType': 'json', 'contentType': 'application/json', 'success': success, 'fail': fail}));
		};
		var mail = function () {
			var success = function (result) {
				print (result);
			};
			var fail = function (a, b, c) {
				print ('Run error:', a, b, c);
			};
			$.ajax (dict ({'url': 'http://www.transcrypt.org/mail', 'type': 'POST', 'data': JSON.stringify (list ([document.getElementById ('mail_address').value, editor.getValue ()])), 'dataType': 'json', 'contentType': 'application/json', 'success': success, 'fail': fail}));
		};
		var selectExample = function () {
			var success = function (result) {
				editor.setValue (result [0]);
				turtle.reset ();
				window.terminate = true;
				console.log (result [1]);
				eval (result [1]);
			};
			var fail = function (a, b, c) {
				print ('Select example error:', a, b, c);
			};
			var py_selector = document.getElementById ('select_example');
			$.ajax (dict ({'url': 'http://www.transcrypt.org/example', 'type': 'POST', 'data': JSON.stringify (py_selector.options [py_selector.selectedIndex].value), 'dataType': 'json', 'contentType': 'application/json', 'success': success, 'fail': fail}));
		};
		selectExample ();
		__pragma__ ('<use>' +
			'math' +
			'random' +
			'turtle' +
		'</use>')
		__pragma__ ('<all>')
			__all__.clear = clear;
			__all__.mail = mail;
			__all__.run = run;
			__all__.selectExample = selectExample;
		__pragma__ ('</all>')
	}) ();
