'''Renders a wireframe Bezier surface, using two-dimensional evaluators.'''
	
import sys
import math

from OpenGL.GLUT import *
from OpenGL.GL import *
from OpenGL.GLU import *

def init():
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGBA | GLUT_DEPTH)
	global controlPoints
	controlPoints =	(((-1.5, -1.5,  4.0),
				  (-0.5, -1.5,  2.0),
				  ( 0.5, -1.5, -1.0),
				  ( 1.5, -1.5,  2.0),),
				 ((-1.5, -0.5,  1.0),
				  (-0.5, -0.5,  3.0),
				  ( 0.5, -0.5,  0.0),
				  ( 1.5, -0.5, -1.0),),
				 ((-1.5,  0.5,  4.0),
				  (-0.5,  0.5,  0.0),
				  ( 0.5,  0.5,  3.0),
				  ( 1.5,  0.5,  4.0),),
				 ((-1.5,  1.5, -2.0),
				  (-0.5,  1.5, -2.0),
				  ( 0.5,  1.5,  0.0),
				  ( 1.5,  1.5, -1.0),),)
	#glMap2f(GL_MAP2_VERTEX_3,  0, 1,  3, 4,  0, 1,  12, 4, &ctrlpoints[0][0][0]);
	glMap2f(GL_MAP2_VERTEX_3, 0, 1, 0, 1, controlPoints)
	glEnable(GL_MAP2_VERTEX_3)
	glMapGrid2f(20, 0, 1, 20, 0, 1)
	glEnable(GL_DEPTH_TEST)
	glShadeModel(GL_FLAT)

	
def display():
	global controlPoints
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
	glColor3f(1, 1, 1)
	glPushMatrix()
	glRotatef(85, 1, 1, 1)
	for j in range(8):
		glBegin(GL_LINE_STRIP)
		for i in range(30):
			glEvalCoord2f(i/30.0, j/8.0)
		glEnd()
		glBegin(GL_LINE_STRIP)
		for i in range(30):
			glEvalCoord2f(j/8.0, i/30.0)
		glEnd()
		
	glPointSize(5)
	
	colors = (
		(1, 0, 0), 
		(0, 1, 0),
		(0, 0, 1),
		(1, 1, 0)
	)

	for index, group in enumerate (controlPoints):
		glColor3fv(colors[index])
		glBegin(GL_LINE_STRIP);
		for point in  group:
			glVertex3fv(point)
		glEnd();
	
	glPopMatrix()
	glFlush()
	
def reshape(w, h):
	glViewport(0, 0, w, h);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluPerspective(140.0, w/h, 1.0, 30.0);
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	glTranslatef(0.0, 0.0, -3.6);
	
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
