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
   glViewport (0, 0, w, h)
   glMatrixMode (GL_PROJECTION)
   glLoadIdentity ()
   # glFrustum (-1.0, 1.0, -1.0, 1.0, 1.5, 20.0)
   gluPerspective(60, 1, 1.5, 20)	# Easier than glFustrum
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