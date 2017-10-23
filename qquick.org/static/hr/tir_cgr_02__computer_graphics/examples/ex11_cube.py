# Reduced viewport

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
   glClearColor (0.0, 0.0, 0.0, 0.0)
   glShadeModel (GL_FLAT)

def display():
   glClear (GL_COLOR_BUFFER_BIT)
   glLoadIdentity ()             # clear the matrix
   gluLookAt (0.0, 3.0, 5.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)	 # viewing transformation
   glPushMatrix()
   glScale (1.0, 2.0, 1.0)      # modeling transformation 
   glColor (1.0, 1.0, 1.0)
   glutWireCube (1.0)
   glPopMatrix()
   glColor (0, 1.0, 0)
   glutWireCube(1.5)
   glFlush ()

def reshape (w, h):
   glViewport (w/4, h/4, w/2, h/2)	# orig left, orig bottom, width, height
   glMatrixMode (GL_PROJECTION)
   glLoadIdentity ()
   glOrtho(-1, 1, -2, 2, 1.5, 20)	# Orthographic
   glMatrixMode (GL_MODELVIEW)

def keyboard(key, x, y):
   if key == chr(27):
      import sys
      sys.exit(0)

glutInit(sys.argv)
glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB)
glutInitWindowSize (500, 500)
glutInitWindowPosition (100, 100)
glutCreateWindow ('cube')
init ()
glutDisplayFunc(display)
glutReshapeFunc(reshape)
glutKeyboardFunc(keyboard)
glutMainLoop()
