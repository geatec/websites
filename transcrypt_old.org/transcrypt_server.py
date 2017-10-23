from josmith import *
import json
import os
import time

class CompilePage (Page):
	def get (self):
		super () .get ()
		
		userDirName = self.app.siteDirName + '/user'
		
		if len (self.json) < 2000:
			with open ('{}/{}'.format (userDirName, 'turtle_code.py'), 'w') as sourceFile:
				sourceFile.write (json.loads (self.json))
				
			origDir = os.getcwd ()
			os.chdir ('/home/sterlicht/transcrypt.org/user')
			os.system ('/home/sterlicht/install/python3.5/bin/transcrypt -b -n turtle_code.py > out.txt')
			os.chdir (origDir)
			
			with open ('{}/__javascript__/{}'.format (userDirName, 'turtle_code.mod.js')) as targetFile:
				self.content = [json.dumps (targetFile.read ())]
				
class ExamplePage (Page):
	def get (self):
		super () .get ()
		
		examplesDirName = self.app.siteDirName + '/../install/python3.5/lib/python3.5/site-packages/transcrypt/demos/turtle_demos'
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
