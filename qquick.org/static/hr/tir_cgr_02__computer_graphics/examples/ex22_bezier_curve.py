'''Use evaluators to draw a Bezier curve.'''

import sys
import math

from OpenGL.GLUT import *
from OpenGL.GL import *
from OpenGL.GLU import *

def init():
	global controlPoints
	controlPoints = ((-4/5.0, -4/5.0, 0),( -2/5.0, 2, 0), (2/5.0, -2.0, 0), (4/5.0, 4/5.0, 0))
	glClearColor(0, 0, 0, 0)
	glShadeModel(GL_FLAT)
	glMap1f(GL_MAP1_VERTEX_3, 0, 1, controlPoints)
	glEnable(GL_MAP1_VERTEX_3)
	
def display():
	'''Display the control points as dots.'''
	global controlPoints
	points = 6
	glClear(GL_COLOR_BUFFER_BIT)
	glColor3f(1, 1, 1)
	glBegin(GL_LINE_STRIP)
	for i in range(points):
		glEvalCoord1f(float(i)/(points-1))
	glEnd()
	glPointSize(5)
	glColor3f(1, 1, 0)
	glBegin(GL_POINTS)
	for point in controlPoints:
		glVertex3fv(point)
	glEnd()
	glFlush()

	
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
glutCreateWindow ('bezier curve')
init ()
glutDisplayFunc(display)
glutReshapeFunc(reshape)
glutKeyboardFunc(keyboard)
glutMainLoop()
