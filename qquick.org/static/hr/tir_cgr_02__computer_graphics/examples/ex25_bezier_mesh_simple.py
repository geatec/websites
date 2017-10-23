'''Renders a lighted filled Bezier surface using two-dimensional evaluators.'''
	
import sys
import math

from OpenGL.GLUT import *
from OpenGL.GL import *
from OpenGL.GLU import *

def init():
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGBA | GLUT_DEPTH)
	controlPoints = (
		(
			(-1, -1, 0), (-1, 1, 0)
		),
		(
			(1, -1, 0), (1, 1, 0)
		)
	)

	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	glTranslatef(0.0, 0.0, -2);
	glRotatef(20, 0, 1, 0)
	
	glEnable(GL_DEPTH_TEST)
	glMap2f(GL_MAP2_VERTEX_3, 0, 1, 0, 1, controlPoints)
	glEnable(GL_MAP2_VERTEX_3)
	glEnable(GL_AUTO_NORMAL)
	glMapGrid2f(20, 0, 1, 20, 0, 1)
	glEnable(GL_LIGHTING)
	glEnable(GL_LIGHT0)
	glLightfv(GL_LIGHT0, GL_AMBIENT, (0.5, 0.5, 0.5, 1))
	glLightfv(GL_LIGHT0, GL_POSITION, (0, 0, 1, 1))
	glMaterialfv(GL_FRONT, GL_DIFFUSE, (0.5, 0.5, 0.5, 1))
	glMaterialfv(GL_FRONT, GL_SPECULAR, (1, 1, 1, 1))
	glMaterialfv(GL_FRONT, GL_SHININESS, (50))

def display():
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
	glEvalMesh2(GL_FILL, 0, 20, 0, 20)
	glFlush()
	
def reshape(w, h):
	glViewport(0, 0, w, h);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluPerspective(100.0, w/h, 1, 30.0);

	
def keyboard(key, x, y):
	pass
	
glutInit(sys.argv)
glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH | GLUT_MULTISAMPLE)
glutInitWindowSize (500, 500)
glutInitWindowPosition (100, 100)
glutCreateWindow ('bezier surface')
init ()
glutDisplayFunc(display)
glutReshapeFunc(reshape)
glutKeyboardFunc(keyboard)
glutMainLoop()
