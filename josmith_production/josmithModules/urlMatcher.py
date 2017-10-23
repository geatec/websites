import datetime
import copy
import traceback

import util
import basePages

class UrlMatcher:
	def __init__ (self, app):
		self.app = app
		
	def getUrlPatterns (self):
		self.urlPatterns = [[[chunk for chunk in urlPattern [0] .split ('/') if chunk]] + list (urlPattern [1:]) for urlPattern in self.app.urlPatterns]
			
	def callMatching (self, environ):
		try:
			url = [chunk for chunk in environ ['PATH_INFO'].lower () .split ('/') if chunk]
			
			bestMatchLength = -1
			bestMatch = []
			
			bestUrlPattern = None
			# The best URL pattern is the pattern that
			#	Condition 1: Has the same nr of chunks as the actual URL
			#   Condition 2: Has no chunks that contradict the actual URL
			#	Condition 3: Starts with the largest number of exactly matching (non parameter) chunks (do not have to be adjacent)
			#
			# Wildcards
			#	* matches 0 or more chunks
			#	+ matches 1 or more chunks
			
			for urlPattern in self.urlPatterns:
				if urlPattern [0] and urlPattern [0][-1] in ('*', '+'):
					# urlPattern = copy.deepcopy (urlPattern)
					urlPattern = [copy.deepcopy (urlPattern [0])] + urlPattern [1:]	# ??? Why is a copy of the tail needed
					
					popped = urlPattern [0] .pop ()
					if popped == '+':	# One or more chunks
						urlPattern [0] .append ('?')
					if len (urlPattern [0]) < len (url):
						urlPattern [0] += (len (url) - len (urlPattern [0])) * ['?']
					
				if len (urlPattern [0]) != len (url):	# Condition 1
					continue
					
				match = []
				for chunkPair in zip (urlPattern [0], url):
					if chunkPair [0] == chunkPair [1]:	# Exactly matching chunk as in condition 3
						match.append (chunkPair [1])
					elif chunkPair [0] .startswith ('?'):			# Condition 2 still satisfied
						pass
					else:								# Condition 2 violated so reject pattern
						break
				else:									# No break seen, so pattern not rejected
					if len (match) > bestMatchLength:	# Evaluate condition 3
						bestMatchLength = len (match)
						bestMatch = match
						bestUrlPattern = urlPattern
									
			if bestUrlPattern == None:					# All patterns rejected
				raise Exception ('No matching URL pattern found')
					
			args = []
			kwargs = {}
			for chunkPair in zip (bestUrlPattern [0], url):
				if chunkPair [0] .startswith ('?'):
					if len (chunkPair [0]) == 1:
						args.append (chunkPair [1])
					else:
						kwargs [chunkPair [0][1:]] = chunkPair [1]
					
			fixedArgs = bestUrlPattern [2:]
			
			return bestUrlPattern [1] (environ, tuple (bestMatch), *(fixedArgs + args), **kwargs)	# May raise exception
		except:
			return basePages.NotFoundPage (environ, None, stacktrace = traceback.format_exc ())
