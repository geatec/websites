'''Renders a lighted filled Bezier surface using two-dimensional evaluators.'''
	
import sys
import math

from OpenGL.GLUT import *
from OpenGL.GL import *
from OpenGL.GLU import *

def init():
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGBA | GLUT_DEPTH)
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();	
	glEnable(GL_DEPTH_TEST)
	glEnable(GL_LIGHTING)
	glEnable(GL_LIGHT0)
	glLightfv(GL_LIGHT0, GL_AMBIENT, (0.5, 0.5, 0.5, 1))
	glLightfv(GL_LIGHT0, GL_POSITION, (0, 0, 1, 1))
	glMaterialfv(GL_FRONT, GL_DIFFUSE, (0.5, 0.5, 0.5, 1))
	glMaterialfv(GL_FRONT, GL_SPECULAR, (1, 1, 1, 1))
	glMaterialfv(GL_FRONT, GL_SHININESS, (50))

def display():
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
	glBegin(GL_TRIANGLES)
	glColor(1, 1, 1, 1)
	glVertex3f( 0, 1, -5)
	glVertex3f(-1,-1, -5)
	glVertex3f( 1,-1, -5)
	glEnd()
	glFlush()
	
def reshape(w, h):
	glViewport(0, 0, w, h);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluPerspective(45.0, w/float(h), 1, 30.0);

	
def keyboard(key, x, y):
	pass
	
glutInit(sys.argv)
glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH | GLUT_MULTISAMPLE)
glutInitWindowSize (500, 500)
glutInitWindowPosition (100, 100)
glutCreateWindow ('triangle')
init ()
glutDisplayFunc(display)
glutReshapeFunc(reshape)
glutKeyboardFunc(keyboard)
glutMainLoop()
