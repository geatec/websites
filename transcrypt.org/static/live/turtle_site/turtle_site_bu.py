__pragma__ ('alias', 'jq', '$')
__pragma__ ('noalias', 'clear')

def clear ():
    editor.setValue ('')
    
    # turtle.reset ()
    run ()
    
def run ():
    def success (result):
        pass
        # global random
    
        # turtle.reset ()
        # rnd = random    # Save reference to random module from being overwritten
        # eval (result)
        # # __pragma__ ('js', '{}', "let module = await js_import ('../../demos/turtle_demos/__target__/mondrian.js');")
        # random = rnd    # Restore reference to random module
    
    def fail (a, b, c):
        print ('Run error:', a, b, c)

    '''
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
    '''
    
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
    async def awaitImport ():
        __pragma__ ('js', '{}', 'await import ("http://www.transcrypt.org/live/transcrypt/demos/turtle_demos/__target__/mondrian.js")')

    def success (result):
        editor.setValue (result [0])
        __pragma__ ('js', '{}', 'awaitImport () .then () .catch ()')
        
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

    