from josmith import *
import json
import os
import os.path
import time
import smtplib
from email.mime.text import MIMEText
import traceback
import subprocess

maxChars = 5000

class ExamplePage (Page):
    def get (self):
        super () .get ()
        
        examplesDirName = self.app.siteDirName + '/static/live/transcrypt/demos/turtle_demos'
        fileNameHead = json.loads (self.json)
        
        if fileNameHead == 'clear':
            self.content = [json.dumps ('')]
        elif fileNameHead in [
            'star',
            'mandala',
            'snowflake',
            'mondrian'
        ]:
            with open ('{}/{}.py'.format (examplesDirName, fileNameHead)) as sourceFile:
                with open ('{}/__javascript__/{}.mod.js'.format (examplesDirName, fileNameHead)) as targetFile:
                    self.content = [json.dumps ([sourceFile.read (), targetFile.read ()])]
                    
class CompilePage (Page):
    def get (self):
        super () .get ()
        
        if len (self.json) < maxChars:
            timeString = str (time.time ()) .replace ('.', '_')
            filePrename = 'turtle_code_{}'.format (timeString)
            sourcePath = '{}.py'.format (filePrename)
            targetPath = '__javascript__/{}.mod.js'.format (filePrename)
            byproductPath = '__javascript__/{}.js'.format (filePrename)
            
            origDirName = os.getcwd ()
            sourceDir = self.app.siteDirName + '/user'
            os.chdir (sourceDir)
        
            with open (sourcePath, 'w') as sourceFile:
                sourceFile.write (json.loads (self.json))

            try:
                result = str (subprocess.run (['/home/sterlicht/.local/bin/transcrypt', '-b', '-n', '-xc', sourcePath], env = os.environ, cwd = sourceDir))
            except Exception as exception:
                result = str (exception)
                
            resultFile = open ('result.txt', 'w')
            resultFile.write ('{}\n'.format (result))
            resultFile.close ()
                
            os.remove (sourcePath)
            os.remove (byproductPath)
            
            with open (targetPath) as targetFile:
                self.content = [json.dumps (targetFile.read ())]
                
            os.remove (targetPath)
 
            os.chdir (origDirName)   
                            
class MailPage (Page):
    def get (self):
        super () .get ()

        receiver, body = json.loads (self.json)
        sender = 'info@transcrypt.org'
        if len (body) < maxChars:       
            try:
                message = MIMEText (body)
                message ['Subject'] = 'Turtle graphics from www.trancrypt.org'
                message ['From'] = receiver
                message ['To'] = 'info@transcrypt.org'

                smtp = smtplib.SMTP ('smtp.alwaysdata.com')
                smtp.sendmail (sender, [receiver], message.as_string () .replace ('\t', '    '))
                smtp.quit ()
            except Exception as e:
                receiver = traceback.format_exc ()
                
            self.content = [json.dumps ('\n\n 8 Mail was sent to: {}'.format (receiver))]
            