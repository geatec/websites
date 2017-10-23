from josmith import *

class DownloadStatePage (Page):
	def config (self):
		self.allowedRoleNames = ['super_user']

	def get (self):
		super () .get ()

		with open (self.app.stateFileName) as stateFile:
			state = stateFile.read ()
				
		self.content = [state]
		
class UploadStatePage (Page):
	def config (self):
		self.allowedRoleNames = ['super_user']

	def get (self):
		super () .get ()
			
		with open (self.app.stateFileName, 'w') as stateFile:
			stateFile.write (self.json)
		
		self.content = ['State saved']
		