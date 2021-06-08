import os
import sys

sys.path.append (os.path.dirname (os.path.realpath (__file__)) + '/../josmith')

from josmith import *

class Site (App):
	def config (self):
		self.logToFile = True
		self.debug = False
		self.domainName = 'wiztech.nl'
		self.forceClairvoyant = False
		self.jQueryClause = self.getScriptClause ('http://code.jquery.com/jquery-latest.min.js')
		self.faviconClause = self.getFaviconClause ('http://' + self.domainName + '/favicon.ico')

		self.urlPatterns = [
			['', StaticPage, 'index'],
			['+', StaticPage],
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
