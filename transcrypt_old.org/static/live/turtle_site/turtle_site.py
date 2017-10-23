__pragma__ ('alias', 'jq', '$')

# For use by eval'ed turtle applet
import turtle
import random
import math

def clear ():
	editor.setValue ('')
	turtle.reset ()
	run ()
	
def run ():
	def success (result):
		turtle.reset ()
		eval (result)
	
	def fail (a, b, c):
		print ('Run error:', a, b, c)

	# N.B. The request has to be explicitly encoded, but the response is already implicitly decoded
	jq.ajax ({
		'url':'http://www.transcrypt.org/compile',
		'type': 'POST',
		'data': JSON.stringify (editor.getValue ()),
		'dataType': 'json',
		'contentType': 'application/json',
		'success': success,
		'fail': fail
	})
	
def mail ():
	window.location.href = '''
		mailto:{}
		?body={}
		&subject=Turtle graphics from www.transcrypt.org
	'''.format (
		escape (document.getElementById ('mail_address') .value),
		editor.getValue () .replace ('\n', '%0D%0A') .replace ('\t', '    ')
	)
	
def selectExample ():
	def success (result):
		editor.setValue (result [0])
		turtle.reset ()		# Using old paths
		window.terminate = True
		eval (result [1])	# Using new paths (so cannot clear old result)
		
	def fail (a, b, c):
		print ('Select example error:', a, b, c)
		
	selector = document.getElementById ('select_example')
	
	jq.ajax ({
		'url':'http://www.transcrypt.org/example',
		'type': 'POST',
		'data': JSON.stringify (selector.options [selector.selectedIndex] .value),
		'dataType': 'json',
		'contentType': 'application/json',
		'success': success,
		'fail': fail
	})
	
selectExample ()

	