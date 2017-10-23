__pragma__ ('alias', 'jq', '$')
__pragma__ ('noalias', 'clear')

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
        global random
    
        turtle.reset ()
        rnd = random
        eval (result)
        random = rnd
    
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
    def success (result):
        print (result)
    
    def fail (a, b, c):
        print ('Run error:', a, b, c)
        
    jq.ajax ({
        'url':'http://www.transcrypt.org/mail',
        'type': 'POST',
        'data': JSON.stringify ([document.getElementById ('mail_address') .value, editor.getValue ()]),
        'dataType': 'json',
        'contentType': 'application/json',
        'success': success,
        'fail': fail
    })
    
def selectExample ():
    def success (result):
        editor.setValue (result [0])
        turtle.reset ()     # Using old paths
        window.terminate = True
        console.log (result [1])
        eval (result [1])   # Using new paths (so cannot clear old result)
        
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

    