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
		self.objects = []
		self.div = document.createElement ('div')
		self.div.style.position = 'absolute'
		self.div.style.width = self.width
		self.div.style.height = self.height
		self.div.ondragover = self.dragOver
		self.div.ondrop = self.drop
		document.body.appendChild (self.div)
		
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
				url = e.dataTransfer.getData ('text/plain')
				dragObject = Image (url)
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
	normWidth = 200
	normHeight = 200
	def __init__ (self, url, x = 0, y = 0):	
		def load (e):
			if self.img.width * self.img.height > self.normWidth * self.normHeight:
				if self.img.width > self.normWidth:
					self.img.style.width = self.normWidth
					self.img.style.height = 'auto'
					
				if self.img.height > self.normHeight:
					self.img.style.height = self.normHeight
					self.img.style.width = 'auto'
				
			print ('Image loaded', x, y)
		
		canvas.objects.append (self)
		
		self.img = document.createElement ('img')
		self.img.xyrefObject = self
		self.img.onload = lambda: load ()
		self.img.src = url
		self.img.style.position = 'absolute'
		
		self.x = x
		self.y = y
					
		self.img.draggable = True
		self.img.onmouseover = self.mouseOver
		self.img.ondragstart = self.dragStart
		self.img.oncontextmenu = self.contextMenu
		document.body.appendChild (self.img)

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
		document.body.removeChild (self.img)
		e.preventDefault ()
		
	def getX (self):
		return int (self.img.style.left [:-2])
		
	def setX (self, value):
		self.img.style.left = value
	
	x = property (getX, setX)
	
	def getY (self):
		return int (self.img.style.top [:-2])
	
	def setY (self, value):
		self.img.style.top = value
		
	y = property (getY, setY)
	
	def getUrl (self):
		return self.img.src
	
	def setUrl (self, value):
		self.img.src = value
		
	url = property (getUrl, setUrl)
	
	def getState (self):
		return {'url': self.url, 'x': self.x, 'y': self.y}
		
	def setState (self, value):
		self.url = value ['url']
		self.x = value ['x']
		self.y = value ['y']
		return self

