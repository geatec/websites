import os
import sys

sys.path.append (os.path.dirname (os.path.realpath (__file__)) + '/../josmith')
sys.path.append (os.path.dirname (os.path.realpath (__file__)) + '/dynamic')

from josmith import *
from singlePicturePage import *
from indexPage import *

import portfolio

class Site (App):
	def config (self):
		self.logToFile = True
		self.debug = False
		self.domainName = 'annadehooge.com'
		self.cookieName = 'annadehooge_4711.com'
		self.jQueryClause = self.getScriptClause ('http://code.jquery.com/jquery-latest.min.js')
		self.faviconClause = self.getFaviconClause ('http://' + self.domainName + '/favicon.ico')

		self.defaultUserEmailAddress = 'annadehooge@gmail.com'
		self.defaultUserPassword = '10Google20'
		
		self.googleAnalyticsClause = '''
			<script>
				(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

				ga('create', 'UA-59363754-1', 'auto');
				ga('send', 'pageview');
			</script>
		'''

		self.urlPatterns = [
			['', IndexPage],
			['index/*', IndexPage],
			['single_picture/*', SinglePicturePage],
			['+', StaticPage],
		]
		
		self.darkBackgroundColor = 'rgba(37,37,34,1)'
		self.lightBackgroundColor = 'rgba(48,48,40,1)'
		self.glowBackgroundColor = 'dddd55'
		self.lightForegroundColor = 'rgba(255,255,240,1)'
		self.darkForegroundColor = 'rgba(119,119,112,1)'
		
		self.portfolio = portfolio

	def __call__ (self, environ, start_response):
		if not environ ['PATH_INFO'] .strip () .lower () .split ('.') [-1] in ('ico', 'jpg', 'log'):
			referrer = 'ip: {}, {} --> {}{}'.format (
				environ ['HTTP_X_FORWARDED_FOR'] if 'HTTP_X_FORWARDED_FOR' in environ else environ ['REMOTE_ADDR'],
				environ ['HTTP_REFERER'] if 'HTTP_REFERER' in environ else 'browser',
				environ ['HTTP_HOST'],
				environ ['PATH_INFO']
			)
			self.log (referrer, context = 'access')
				
		return super () .__call__ (environ, start_response)
		
application = Site (__file__, __name__)