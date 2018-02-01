from ts_base import *

class Documentation:
	def __init__ (self, master):
		self.master = master
					
	def getStructure (self):
		return '''
			<iframe
				class="content"
				src="http://sterlicht.alwaysdata.net/transcrypt.org/docs/html/"
			>
			</iframe>
		'''
	
				
	def getLayout (self):
		return '''
			.content {
				position: fixed;
				top: 15%;
				height: 85%;
				width: 100%;
				z-index: 2;
			}
			
			.master-structure .footer {
				visibility: hidden;
			}
		'''
		
	def getScale (self):
		return '''
		'''
		