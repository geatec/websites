'''Demonstrates polygon tessellation.'''
'''Two tesselated objects are drawn a rectangle with a triangular hole and a smooth shaded, self-intersecting star.'''
'''The exterior rectangle is drawn with its vertices in counter-clockwise order, but its interior clockwise.'''
'''combineCallback is needed for the self-intersecting star.'''
'''Removing the TessProperty for the star will make the interior unshaded (WINDING_ODD).'''

import sys
import math

from OpenGL.GLUT import *
from OpenGL.GL import *
from OpenGL.GLU import *

def beginCallback(which):
	glBegin(which)

def errorCallback(errorCode):
	raise SystemError('Tessellation Error:', gluErrorString(errorCode))

def endCallback():
	glEnd()

def vertexCallback(vertex, color):
	glColor3d(*color)
	glVertex3d(*vertex)

def combineCallback(coords, vertexData, weight, dataOut):
	'''Creates a new vertex when edges intersect.'''
	'''Coordinate location is trivial to calculate,'''
	'''but weight[4] may be used to average color, normal, or texture  coordinate data.'''
	'''In this program, color is weighted.'''
	vertex = coords
	for i in range(3,7):
		vertex[i] = (
			weight[0] * vertex_data[0][i] +
			weight[1] * vertex_data[1][i] +
			weight[2] * vertex_data[2][i] +
			weight[3] * vertex_data[3][i]
		)
	dataOut = vertex

def init():
	rect = (	( 50,  50, 0),
			(200,  50, 0),
			(200, 200, 0),
			( 50, 200, 0),)
	tri = (	( 75,  75, 0),
			(125, 175, 0),
			(175,  75, 0),)
	star = (	(250,  50, 0, 1, 0, 1),
			(325, 200, 0, 1, 1, 0),
			(400,  50, 0, 0, 1, 1),
			(250, 150, 0, 1, 0, 0),
			(400, 150, 0, 0, 1, 0),)
	global startList, tesselation
	startList = glGenLists(2)
	tesselation = gluNewTess()
	gluTessCallback(tesselation, GLU_TESS_VERTEX, glVertex3dv)
	gluTessCallback(tesselation, GLU_TESS_BEGIN,  beginCallback)
	gluTessCallback(tesselation, GLU_TESS_END,    endCallback)
	gluTessCallback(tesselation, GLU_TESS_ERROR,  errorCallback)
	# Rectangle with a triangular hole inside.
	glNewList(startList, GL_COMPILE)
	glShadeModel(GL_FLAT)
	gluTessBeginPolygon(tesselation, None)
	gluTessBeginContour(tesselation)
	gluTessVertex(tesselation, rect[0], rect[0])
	gluTessVertex(tesselation, rect[1], rect[1])
	gluTessVertex(tesselation, rect[2], rect[2])
	gluTessVertex(tesselation, rect[3], rect[3])
	gluTessEndContour(tesselation)
	gluTessBeginContour(tesselation)
	gluTessVertex(tesselation, tri[0], tri[0])
	gluTessVertex(tesselation, tri[1], tri[1])
	gluTessVertex(tesselation, tri[2], tri[2])
	gluTessEndContour(tesselation)
	gluTessEndPolygon(tesselation)
	glEndList()
	gluTessCallback(tesselation, GLU_TESS_VERTEX,  vertexCallback)
	gluTessCallback(tesselation, GLU_TESS_BEGIN,   beginCallback)
	gluTessCallback(tesselation, GLU_TESS_END,     endCallback)
	gluTessCallback(tesselation, GLU_TESS_ERROR,   errorCallback)
	gluTessCallback(tesselation, GLU_TESS_COMBINE, combineCallback)
	# Smooth shaded, self-intersecting star.
	# glNewList(startList + 1, GL_COMPILE)
	# glShadeModel(GL_SMOOTH)
	# gluTessProperty(tesselation, GLU_TESS_WINDING_RULE, GLU_TESS_WINDING_POSITIVE)
	# gluTessBeginPolygon(tesselation, None)
	# gluTessBeginContour(tesselation)
	# gluTessVertex(tesselation, star[0], star[0])
	# gluTessVertex(tesselation, star[1], star[1])
	# gluTessVertex(tesselation, star[2], star[2])
	# gluTessVertex(tesselation, star[3], star[3])
	# gluTessVertex(tesselation, star[4], star[4])
	# gluTessEndContour(tesselation)
	# gluTessEndPolygon(tesselation)
	# glEndList()
	gluDeleteTess(tesselation)
	
def display():
	glClear(GL_COLOR_BUFFER_BIT)
	glColor3f(1, 1, 1)
	glCallList(startList)
	# glCallList(startList + 1)
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
glutCreateWindow ('texture')
init ()
glutDisplayFunc(display)
glutReshapeFunc(reshape)
glutKeyboardFunc(keyboard)
glutMainLoop()
