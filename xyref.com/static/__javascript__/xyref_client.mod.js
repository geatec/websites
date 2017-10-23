	(function () {
		var dragObject = null;
		var dragOffset = list ([null, null]);
		var Canvas = __class__ ('Canvas', [object], {
			get __init__ () {return __get__ (this, function (self) {
				self.div = document.createElement ('div');
				self.div.style.position = 'absolute';
				self.div.style.width = self.width;
				self.div.style.height = self.height;
				self.div.ondragover = self.dragOver;
				self.div.ondrop = self.drop;
				document.body.appendChild (self.div);
				self.objects = list ([]);
				self.dirty = false;
				self.downloadState ();
			});},
			get dragOver () {return __get__ (this, function (self, e) {
				e.dataTransfer.dropEffect = 'move';
				e.preventDefault ();
			});},
			get drop () {return __get__ (this, function (self, e) {
				if (true || self.stateDownloaded) {
					self.dirty = true;
					if (!(dragObject)) {
						dragObject = Image (e.dataTransfer.getData ('text/plain'));
					}
					dragObject.x = e.x - dragOffset [0];
					dragObject.y = e.y - dragOffset [1];
					dragObject = null;
				}
				e.preventDefault ();
			});},
			get getState () {return __get__ (this, function (self) {
				// pass;
			});},
			get setState () {return __get__ (this, function (self, value) {
				// pass;
			});},
			get downloadState () {return __get__ (this, function (self) {
				var ready = function (result) {
					print ('download ready');
					self.stateDownloaded = true;
					self.dirty = false;
					self.div.style.backgroundColor = '#7777ff';
					self.setState (result.text);
				};
				self.stateDownloaded = false;
				self.div.style.backgroundColor = '#000000';
				$.get ('http://www.xyref.com/download_state', '', ready, 'json');
			});},
			get uploadState () {return __get__ (this, function (self) {
				var ready = function (result) {
					print ('upload ready');
					self.dirty = false;
				};
				if (self.dirty) {
					$.post ('http://www.xyref.com/upload_state', 'HERE SHOULD BE DATA!!!', ready, 'json');
					return true;
				}
				else {
					return false;
				}
			});}
		});
		Canvas.width = 5000;
		Canvas.height = 3000;
		var canvas = Canvas ();
		var Image = __class__ ('Image', [object], {
			get __init__ () {return __get__ (this, function (self, url, x, y) {
				if (typeof x == 'undefined' || (x != null && x .__class__ == __kwargdict__)) {;
					var x = 0;
				};
				if (typeof y == 'undefined' || (y != null && y .__class__ == __kwargdict__)) {;
					var y = 0;
				};
				self.div = document.createElement ('div');
				self.div.xyrefObject = self;
				self.div.style.position = 'absolute';
				self.div.style.width = self.width;
				self.div.style.height = self.height;
				self.div.style.backgroundRepeat = 'no-repeat';
				self.div.style.backgroundSize = 'contain';
				self.div.draggable = true;
				self.div.onmouseover = self.mouseOver;
				self.div.ondragstart = self.dragStart;
				self.div.oncontextmenu = self.contextMenu;
				document.body.appendChild (self.div);
				self.url = url;
				self.x = x;
				self.y = y;
				canvas.objects.append (self);
			});},
			get mouseOver () {return __get__ (this, function (self, e) {
				e.target.style.cursor = 'pointer';
			});},
			get dragStart () {return __get__ (this, function (self, e) {
				dragObject = e.target.xyrefObject;
				console.dir (dragObject);
				dragOffset = list ([e.x - dragObject.x, e.y - dragObject.y]);
				e.dataTransfer.effectAllowed = 'move';
			});},
			get contextMenu () {return __get__ (this, function (self, e) {
				canvas.objects.remove (self);
				document.body.removeChild (self.div);
				e.preventDefault ();
			});},
			get getUrl () {return __get__ (this, function (self) {
				return self._url;
			});},
			get setUrl () {return __get__ (this, function (self, value) {
				self._url = value;
				self.div.style.backgroundImage = 'url("{}")'.format (self._url);
			});},
			get getX () {return __get__ (this, function (self) {
				return self._x;
			});},
			get setX () {return __get__ (this, function (self, value) {
				self._x = value;
				self.div.style.left = self._x;
			});},
			get getY () {return __get__ (this, function (self) {
				return self._y;
			});},
			get setY () {return __get__ (this, function (self, value) {
				self._y = value;
				self.div.style.top = self._y;
			});},
			get getState () {return __get__ (this, function (self) {
				return dict ({'url': self.url, 'x': self.x, 'y': self.y});
			});},
			get setState () {return __get__ (this, function (self, value) {
				self.url = value ['url'];
				self.x = value ['x'];
				self.y = value ['y'];
				return self;
			});}
		});
		Image.width = 150;
		Image.height = 150;
		Object.defineProperty (Image, 'url', property.call (Image, Image.getUrl, Image.setUrl));;
		Object.defineProperty (Image, 'x', property.call (Image, Image.getX, Image.setX));;
		Object.defineProperty (Image, 'y', property.call (Image, Image.getY, Image.setY));;
		__pragma__ ('<all>')
			__all__.Canvas = Canvas;
			__all__.Image = Image;
			__all__.canvas = canvas;
			__all__.dragObject = dragObject;
			__all__.dragOffset = dragOffset;
		__pragma__ ('</all>')
	}) ();
