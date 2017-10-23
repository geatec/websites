import sys

from OpenGL.GLUT import *
from OpenGL.GL import *
from OpenGL.GLU import *

MAXZ = 8.0
MINZ = -8.0
ZINC = 0.4

solidZ = MAXZ
transparentZ = MINZ

def init():
	glEnable(GL_LINE_SMOOTH)
	glEnable(GL_BLEND);
	glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
	glHint(GL_LINE_SMOOTH_HINT, GL_DONT_CARE)
	glLineWidth(1.5)
	global sphereList, cubeList
	mat_specular = 1.0, 1.0, 1.0, 0.15 
	mat_shininess = 100.0 
	position = 0.5, 0.5, 1.0, 0.0 
	glMaterialfv(GL_FRONT, GL_SPECULAR, mat_specular)
	glMaterialfv(GL_FRONT, GL_SHININESS, mat_shininess)
	glLightfv(GL_LIGHT0, GL_POSITION, position)
	glEnable(GL_LIGHTING)
	glEnable(GL_LIGHT0)
	glEnable(GL_DEPTH_TEST)
	sphereList = glGenLists(1)
	glNewList(sphereList, GL_COMPILE)
	glutSolidSphere(0.4, 100, 100)
	glEndList()
	cubeList = glGenLists(1)
	glNewList(cubeList, GL_COMPILE)
	glutWireCube(0.6)
	glEndList()

def display():
	mat_solid = 0.75, 0.75, 0.0, 1.0 
	mat_zero = 0.0, 0.0, 0.0, 1.0
	mat_transparent = 0.0, 0.8, 0.8, 0.6 
	mat_emission = 0.0, 0.3, 0.3, 0.6 
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
	glPushMatrix()
	glTranslatef(-0.15, -0.15, solidZ)
	glMaterialfv(GL_FRONT, GL_EMISSION, mat_zero)
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_solid)
	glCallList(sphereList)
	glPopMatrix()
	glPushMatrix()
	glTranslatef(0.15, 0.15, transparentZ)
	glRotatef(15.0, 1.0, 1.0, 0.0)
	glRotatef(30.0, 0.0, 1.0, 0.0)
	glMaterialfv(GL_FRONT, GL_EMISSION, mat_emission)
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_transparent)
	glEnable(GL_BLEND)
	glDepthMask(GL_FALSE)	# Leave out rear planes of cube that will shine though
	glBlendFunc(GL_SRC_ALPHA, GL_ONE)
	glCallList(cubeList)
	glDepthMask(GL_TRUE)	# Restore in order to draw sphere correctly
	glDisable(GL_BLEND)
	glPopMatrix()
	glutSwapBuffers()
	
def reshape(w, h):
	glViewport(0, 0, w, h)
	glMatrixMode(GL_PROJECTION)
	glLoadIdentity()
	if w <= h:
		glOrtho(-1.5, 1.5, -1.5*h/w, 1.5*h/w, -10.0, 10.0)
	else:
		glOrtho(-1.5*w/h, 1.5*w/h, -1.5, 1.5, -10.0, 10.0)
	glMatrixMode(GL_MODELVIEW)
	glLoadIdentity()
	
def animate():
	global MINZ, MAXZ, ZINC, solidZ, transparentZ
	if solidZ <= MINZ or transparentZ >= MAXZ:
		glutIdleFunc(None)
	else:
		solidZ -= ZINC
		transparentZ += ZINC
		glutPostRedisplay()
	
def keyboard(key, x, y):
	global MINZ, MAXZ, ZINC, solidZ, transparentZ
	if key == 'a':
		solidZ = MAXZ;
		transparentZ = MINZ;
		glutIdleFunc(animate);
	elif key =='r':
		solidZ = MAXZ;
		transparentZ = MINZ;
		glutPostRedisplay();
	
glutInit(sys.argv)
glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH)
glutInitWindowSize (500, 500)
glutInitWindowPosition (100, 100)
glutCreateWindow ('blend')
init ()
glutDisplayFunc(display)
glutReshapeFunc(reshape)
glutKeyboardFunc(keyboard)
glutMainLoop()
