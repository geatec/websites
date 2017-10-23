import sys

from OpenGL.GLUT import *
from OpenGL.GL import *
from OpenGL.GLU import *


def init():
	global fogMode, keybindings
	fogMode = GL_LINEAR
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH)
	glutInitWindowSize(500, 500)
	glEnable(GL_DEPTH_TEST)
	glLightfv(GL_LIGHT0, GL_POSITION, (0.5, 0.5, 3, 0))
	glEnable(GL_LIGHTING)
	glEnable(GL_LIGHT0)
	glMaterialfv(GL_FRONT, GL_AMBIENT,  (0.17450, 01175, 01175))
	glMaterialfv(GL_FRONT, GL_DIFFUSE,  (0.61424, 04136, 04136))
	glMaterialfv(GL_FRONT, GL_SPECULAR, (0.727811, 0.626959, 0.626959))
	glMaterialf(GL_FRONT, GL_SHININESS, 0.6*128)
	glEnable(GL_FOG)
	glFogi(GL_FOG_MODE, fogMode)
	glFogfv(GL_FOG_COLOR, (0.5, 0.5, 0.5, 1))
	glClearColor(0.5, 0.5, 0.5, 1) #fog color
	glFogf(GL_FOG_DENSITY, 0.5)
	glHint(GL_FOG_HINT, GL_DONT_CARE)
	glFogf(GL_FOG_START, 1)
	glFogf(GL_FOG_END, 5)

def renderSphere(r, x, y, z):
	'''Render a sphere at the given point.'''
	glPushMatrix()
	glTranslatef(x, y, z)
	glutSolidSphere(r, 100, 100)
	glPopMatrix()
	
def display():
	'''Draws 5 spheres at different z positions.'''
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
	renderSphere(0.4, -2, -0.5, -5)
	renderSphere(0.5, -1, -0.5, -4)
	renderSphere(0.6, 0, -0.5, -3)
	renderSphere(0.7, 1, -0.5, -2)
	renderSphere(0.8,  2, -0.5, -1)
	glFlush()
	
def toggleFog():
	'''Pressing the f key chooses between 3 types of fog:  exponential, exponential squared, and linear.'''
	global fogMode
	if fogMode == GL_EXP:
		fogMode = GL_EXP2
		print 'Fog mode is GL_EXP2'
	elif fogMode == GL_EXP2:
		fogMode = GL_LINEAR
		print 'Fog mode is GL_LINEAR'
	elif fogMode == GL_LINEAR:
		fogMode = GL_EXP
		print 'Fog mode is GL_EXP'
	glFogi(GL_FOG_MODE, fogMode)	
	glutPostRedisplay()
	
def reshape(w, h):
	glViewport(0, 0, w, h)
	glMatrixMode(GL_PROJECTION)
	glLoadIdentity()
	if w <= h:
		glOrtho(-3, 3, -3*h/w, 3*h/w, -10.0, 10.0)
	else:
		glOrtho(-3*w/h, 3*w/h, -3, 3, -10.0, 10.0)
	glMatrixMode(GL_MODELVIEW)
	glLoadIdentity()
	
def keyboard(key, x, y):
	if key == 'f':
		toggleFog()
	
glutInit(sys.argv)
glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH | GLUT_MULTISAMPLE)
glutInitWindowSize (500, 500)
glutInitWindowPosition (100, 100)
glutCreateWindow ('blend')
init ()
glutDisplayFunc(display)
glutReshapeFunc(reshape)
glutKeyboardFunc(keyboard)
glutMainLoop()
