__pragma__ ('alias', 'jq', '$')
__pragma__ ('skip')
alert = aPrint = document = 0
__pragma__ ('noskip')

dragObject = None
dragOffset = [None, None]

class Canvas:
	width = 5000
	height = 3000
	def __init__ (self):
		self.div = document.createElement ('div')
		self.div.style.position = 'absolute'
		self.div.style.width = self.width
		self.div.style.height = self.height
		self.div.ondragover = self.dragOver
		self.div.ondrop = self.drop
		document.body.appendChild (self.div)
		
		self.objects = []		
		self.dirty = False # Should be redundant		
		self.downloadState ()
				
	def dragOver (self, e):
		e.dataTransfer.dropEffect = 'move'
		e.preventDefault ()
		
	def drop (self, e):
		if True or self.stateDownloaded:
			self.dirty = True
			
			nonlocal dragObject;
			if not dragObject:
				dragObject = Image (e.dataTransfer.getData ('text/plain'))
			dragObject.x = e.x - dragOffset [0]
			dragObject.y = e.y - dragOffset [1]
			dragObject = None	# Leaves image intact, but dragObj
			
		e.preventDefault ()
		
	def getState (self):
		pass
		#return JSON.stringify ([anObject.getState () for anObject in self.objects])
		
	def setState (self, value):
		pass
		#self.objects = [Image (state ['url'], state ['x'], state ['y']) for state in JSON.parse (value)]
	
	def downloadState (self):	
		def ready (result):
			print ('download ready')
			self.stateDownloaded = True
			self.dirty = False
			self.div.style.backgroundColor = '#7777ff'
			self.setState (result.text)

		self.stateDownloaded = False
		self.div.style.backgroundColor = '#000000'
		
		jq.get ('http://www.xyref.com/download_state', '', ready, 'json')
		
	def uploadState (self):
		def ready (result):
			print ('upload ready')
			self.dirty = False
			
		if self.dirty:			
			jq.post ('http://www.xyref.com/upload_state', 'HERE SHOULD BE DATA!!!', ready, 'json')
			return True
		else:
			return False
		
canvas = Canvas ()

class Image:
	width = 150
	height = 150
	def __init__ (self, url, x = 0, y = 0):
		self.div = document.createElement ('div')
		self.div.xyrefObject = self
		self.div.style.position = 'absolute'
		self.div.style.width = self.width
		self.div.style.height = self.height
		self.div.style.backgroundRepeat = 'no-repeat'
		self.div.style.backgroundSize = 'contain'
		self.div.draggable = True
		self.div.onmouseover = self.mouseOver
		self.div.ondragstart = self.dragStart
		self.div.oncontextmenu = self.contextMenu
		document.body.appendChild (self.div)
		
		self.url = url
		self.x = x
		self.y = y
		canvas.objects.append (self)
					
	def mouseOver (self, e):
		e.target.style.cursor = 'pointer'

	def dragStart (self, e):
		nonlocal dragObject
		dragObject = e.target.xyrefObject
		console.dir (dragObject)
		
		nonlocal dragOffset
		dragOffset = [e.x - dragObject.x, e.y - dragObject.y]
		
		e.dataTransfer.effectAllowed = 'move'
		
	def contextMenu (self, e):
		canvas.objects.remove (self)
		document.body.removeChild (self.div)
		e.preventDefault ()
		
	def getUrl (self):
		return self._url
	
	def setUrl (self, value):
		self._url = value
		self.div.style.backgroundImage = 'url("{}")'.format (self._url)
		
	url = property (getUrl, setUrl)
	
	def getX (self):
		return self._x
		
	def setX (self, value):
		self._x = value
		self.div.style.left = self._x
	
	x = property (getX, setX)
	
	def getY (self):
		return self._y
	
	def setY (self, value):
		self._y = value
		self.div.style.top = self._y
		
	y = property (getY, setY)
	
	def getState (self):
		return {'url': self.url, 'x': self.x, 'y': self.y}
		
	def setState (self, value):
		self.url = value ['url']
		self.x = value ['x']
		self.y = value ['y']
		return self

