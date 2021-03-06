__pragma__ ('alias', 'jq', '$')
__pragma__ ('noalias', 'clear')

def clear ():
    editor.setValue ('')
    
    # turtle.reset ()
    run ()
    
def run ():
    def success (result):
        style = '''
            <style>
                #__terminal__ {
                    background-color: darkblue;
                    color: white;
                    font-family: arial;
                    font-size: 14px;
                }
            </style>
        '''

        outputHtml = f'''
            <html>
                <head>
                    <script type="module" src="http://www.transcrypt.org/live/user/{result}">
                    </script>
                    {style}
                </head>
                <body>      
                    <div id="__turtlegraph__" style="position:absolute; height:80%; width:98%;">
                    </div>
                    <div id="__terminal__" style="position:absolute; top:80%; height:19%; width:98%;">
                    </div>
                </body>
            </html>
        '''

        __pragma__ ('js', '{}', "var outputBlob = new Blob ([outputHtml], {type: 'text/html'})")
        outputUrl = URL.createObjectURL (outputBlob)
        document.getElementById ('output') .src = outputUrl
    
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
    selector = document.getElementById ('select_example')
    selectorValue = selector.options [selector.selectedIndex] .value

    def success (result):
        editor.setValue (result [0])

        style = '''
            <style>
                #__terminal__ {
                    background-color: darkblue;
                    color: white;
                    font-family: arial;
                    font-size: 14px;
                }
            </style>
        '''

        outputHtml = f'''
            <html>
                <head>
                    <script type="module" src="http://www.transcrypt.org/live/transcrypt/demos/turtle_demos/__target__/{selectorValue}.js">
                    </script>
                    {style}
                </head>
                <body>      
                    <div id="__turtlegraph__" style="position:absolute; height:80%; width:98%;">
                    </div>
                    <div id="__terminal__" style="position:absolute; top:80%; height:19%; width:98%;">
                    </div>
                </body>
            </html>
        '''

        __pragma__ ('js', '{}', "var outputBlob = new Blob ([outputHtml], {type: 'text/html'})")
        outputUrl = URL.createObjectURL (outputBlob)
        document.getElementById ('output') .src = outputUrl
        
    def fail (a, b, c):
        print ('Select example error:', a, b, c)

    jq.ajax ({
        'url':'http://www.transcrypt.org/example',
        'type': 'POST',
        'data': JSON.stringify (selectorValue),
        'dataType': 'json',
        'contentType': 'application/json',
        'success': success,
        'fail': fail
    })

    
selectExample ()

    