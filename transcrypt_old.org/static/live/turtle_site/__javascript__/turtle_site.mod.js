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
				eval (result);
			};
			var fail = function (a, b, c) {
				print ('Run error:', a, b, c);
			};
			$.ajax (dict ({'url': 'http://www.transcrypt.org/compile', 'type': 'POST', 'data': JSON.stringify (editor.getValue ()), 'dataType': 'json', 'contentType': 'application/json', 'success': success, 'fail': fail}));
		};
		var mail = function () {
			window.location.href = '\n\t\tmailto:{}\n\t\t?body={}\n\t\t&subject=Turtle graphics from www.transcrypt.org\n\t'.format (escape (document.getElementById ('mail_address').value), editor.getValue ().py_replace ('\n', '%0D%0A').py_replace ('\t', '    '));
		};
		var selectExample = function () {
			var success = function (result) {
				editor.setValue (result [0]);
				turtle.reset ();
				window.terminate = true;
				eval (result [1]);
			};
			var fail = function (a, b, c) {
				print ('Select example error:', a, b, c);
			};
			var selector = document.getElementById ('select_example');
			$.ajax (dict ({'url': 'http://www.transcrypt.org/example', 'type': 'POST', 'data': JSON.stringify (selector.options [selector.selectedIndex].value), 'dataType': 'json', 'contentType': 'application/json', 'success': success, 'fail': fail}));
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
