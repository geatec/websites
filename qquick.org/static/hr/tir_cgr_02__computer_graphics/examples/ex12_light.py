#Shading

import sys

try:
	from OpenGL.GLUT import *
	from OpenGL.GL import *
	from OpenGL.GLU import *
except:
	print '''
ERROR: PyOpenGL not installed properly.  
        '''

def init(): 
	mat_specular = 1.0, 1.0, 1.0, 1.0
	mat_shininess = 50.0
	light_position = 1.0, 1.0, 1.0, 0.0
	white_light = 1.0, 1.0, 1.0, 1.0 
	lmodel_ambient = 0.1, 0.1, 0.1, 1.0
	glClearColor(0.0, 0.0, 0.0, 0.0)
	glShadeModel(GL_SMOOTH);
	glMaterialfv(GL_FRONT, GL_SPECULAR, mat_specular)
	glMaterialfv(GL_FRONT, GL_SHININESS, mat_shininess)
	glLightfv(GL_LIGHT0, GL_POSITION, light_position)
	glLightfv(GL_LIGHT0, GL_DIFFUSE, white_light)
	glLightfv(GL_LIGHT0, GL_SPECULAR, white_light)
	glLightModelfv(GL_LIGHT_MODEL_AMBIENT, lmodel_ambient)
	glEnable(GL_LIGHTING)
	glEnable(GL_LIGHT0)
	glEnable(GL_DEPTH_TEST)

def display():
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
	#glutSolidCube (1.0)
	#glLoadIdentity()
	#glRotate(30, 30, 30, 0);
	glutSolidSphere(1.0, 100, 100)
	glFlush()

def reshape (w, h):
	glViewport(0, 0, w, h)
	glMatrixMode(GL_PROJECTION)
	glLoadIdentity()
	if w <= h:
		glOrtho(-1.5, 1.5, -1.5*h/w, 1.5*h/w, -10.0, 10.0) # l, r, b, t, n, f
	else:
		glOrtho(-1.5*w/h, 1.5*w/h, -1.5, 1.5, -10.0, 10.0)
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();

def keyboard(key, x, y):
   if key == chr(27):
      import sys
      sys.exit(0)

glutInit(sys.argv)
glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH)
glutInitWindowSize (500, 500)
glutInitWindowPosition (100, 100)
glutCreateWindow ('light')
init ()
glutDisplayFunc(display)
glutReshapeFunc(reshape)
glutKeyboardFunc(keyboard)
glutMainLoop()
