import sys
import math

from OpenGL.GLUT import *
from OpenGL.GL import *
from OpenGL.GLU import *

def makeCheckImage():
	'''Create checkerboard texture.'''
	width  = 64
	height = 64
	checkImage = height*[width*[0]]
	for i in range(height):
		for j in range(width):
			c = ( ((i&0x8)==0 ) ^ ((j&0x8)==0) )*0xFF
			checkImage[i][j] = c #(c<<24)|(c<<16)|(c<<8)|(0xFF)
	return checkImage

def init():
	global image, texName
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH)
	glShadeModel(GL_FLAT)
	glEnable(GL_DEPTH_TEST)
	#image = makeCheckImage()
	#glPixelStorei(GL_UNPACK_ALIGNMENT, 1)
	# texName = glGenTextures(1)
	# glBindTexture(GL_TEXTURE_2D, texName)
	# glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT)
	# glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT)
	# glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST)
	# glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST)
	# glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 64, 64, 0, GL_RGBA, GL_UNSIGNED_BYTE, image)
	
	import Image, numpy
	img = Image.open('flag_en.bmp') # .jpg, .bmp, etc. also work
	img_data = numpy.array(list(img.getdata()), numpy.int8)
	
	global texture
	texture = glGenTextures(1)
	glPixelStorei(GL_UNPACK_ALIGNMENT,1)
	glBindTexture(GL_TEXTURE_2D, texture)
	glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT)
	glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT)
	glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR)
	glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR)
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, img.size[0], img.size[1], 0, GL_RGB, GL_UNSIGNED_BYTE, img_data)
	
def display():
	#global texName
	global texture
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
	glEnable(GL_TEXTURE_2D)
	glTexEnvf(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE, GL_DECAL)
	glBindTexture(GL_TEXTURE_2D, texture)
	#glBindTexture(GL_TEXTURE_2D, texName)
	glBegin(GL_QUADS)
	glTexCoord2f(0, 0)
	glVertex3f(-2, -1, 0)
	glTexCoord2f(0, 10)
	glVertex3f(-2, 1, 0)
	glTexCoord2f(10, 10)
	glVertex3f(0, 1, 0)
	glTexCoord2f(10, 0)
	glVertex3f(0, -1, 0)
	glTexCoord2f(0, 0)
	glVertex3f(1, -1, 0)
	glTexCoord2f(0, 10)
	glVertex3f(1, 1, 0)
	glTexCoord2f(10, 10)
	glVertex3f(1+math.sqrt(2), 1, -math.sqrt(2))
	glTexCoord2f(10, 0)
	glVertex3f(1+math.sqrt(2), -1, -math.sqrt(2))
	glEnd()
	glFlush()
	glDisable(GL_TEXTURE_2D)
	
def reshape(w, h):
	glViewport(0, 0, w, h);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluPerspective(60.0, w/h, 1.0, 30.0);
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	glTranslatef(0.0, 0.0, -3.6);
	
def keyboard(key, x, y):
	pass
	
glutInit(sys.argv)
glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH | GLUT_MULTISAMPLE)
glutInitWindowSize (500, 500)
glutInitWindowPosition (100, 100)
glutCreateWindow ('texture')
init ()
glutDisplayFunc(display)
glutReshapeFunc(reshape)
glutKeyboardFunc(keyboard)
glutMainLoop()
