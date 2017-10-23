import os
import sys

sys.path.append (os.path.dirname (os.path.realpath (__file__)) + '/../josmith')
sys.path.append (os.path.dirname (os.path.realpath (__file__)))

from josmith import *
from xyref_server import *

class Site (App):
	def config (self):
		self.logToFile = True
		self.debug = True
		# self.forceClairvoyant = True
		self.clairChunks = ['__javascript__']	# Even if not clairvoyant, these chunks in a URL do not block non-treebrowsing access
		self.domainName = 'xyref.com'
		self.faviconClause = self.getFaviconClause ('http://' + self.domainName + '/favicon.ico')
		self.statesDirName = self.siteDirName + '/states'
		self.stateFileName = self.statesDirName + '/state.json'
		
		self.defaultUserEmailAddress = ''
		self.defaultUserPassword = ''		

		self.urlPatterns = [
			['', StaticPage, 'index'],
			['+', StaticPage],
			['upload_state/*', UploadStatePage],
			['download_state/*', DownloadStatePage],
		]

	def __call__ (self, environ, start_response):
		if environ ['PATH_INFO'] .strip () .lower () .split ('.') [-1] in ('/', 'html', 'zip'):
			referrer = 'ip: {}, {} --> {}{}'.format (
				environ ['HTTP_X_FORWARDED_FOR'] if 'HTTP_X_FORWARDED_FOR' in environ else environ ['REMOTE_ADDR'],
				environ ['HTTP_REFERER'] if 'HTTP_REFERER' in environ else 'browser',
				environ ['HTTP_HOST'],
				environ ['PATH_INFO']
			)
			self.log (referrer, context = 'access')
								
		return super () .__call__ (environ, start_response)
		
application = Site (__file__, __name__)
