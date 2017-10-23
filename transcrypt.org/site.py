import os
import sys

sys.path.append (os.path.dirname (os.path.realpath (__file__)) + '/../josmith')
sys.path.append (os.path.dirname (os.path.realpath (__file__)))

from josmith import *
from transcrypt_server import *

class Site (App):
	def __init__ (self, siteFileName, siteModuleName):
		self.staticPath = os.path.dirname (os.path.realpath (__file__)) + '/static'
		sys.path.append (self.staticPath)

		App.__init__ (self, siteFileName, siteModuleName)

		self.log.pushContext ('message')
		self.log ('Python version: {}'.format (sys.version))
		self.log.popContext ()

	def config (self):
		self.logToFile = True
		self.debug = True
		self.domainName = 'transcrypt.org'
		self.forceClairvoyant = True
		self.clairChunks = ['__javascript__']	# Even if not clairvoyant, these chunks in a URL do not block non-treebrowsing access
		self.jQueryClause = self.getScriptClause ('http://code.jquery.com/jquery-latest.min.js')
		self.faviconClause = self.getFaviconClause ('http://' + self.domainName + '/favicon.ico')

		self.urlPatterns = [
			['', StaticPage, 'home'],
			['+', StaticPage],
			['example/*', ExamplePage],
			['compile/*', CompilePage],
			['mail/*', MailPage],
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
		
	def importFromFile (self, relPathInsideStatic, moduleName):
		import importlib.machinery
		import importlib.util
		
		# BEGIN For Python > 3.4
		# loader = importlib.machinery.SourceFileLoader (moduleName, filePath)
		# spec = importlib.util.spec_from_loader (loader.name, loader)
		# mod = importlib.util.module_from_spec (spec)
		# loader.exec_module (mod)
		# END For Python > 3.4
		
		import imp
		absPath = self.staticPath + '/' + relPathInsideStatic
		with open (absPath, 'U') as aFile:
			mod = imp.load_module (moduleName, aFile, absPath, ('.py', 'U', imp.PY_SOURCE))
				
		return mod
		
	def readFromFile  (self, relPathInsideStatic):
		with open (self.staticPath + '/' + relPathInsideStatic) as aFile:
			return aFile.read () .replace ('<', '&lt') .replace ('>', '&gt')
			
application = Site (__file__, __name__)