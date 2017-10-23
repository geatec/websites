import sys

try:
  from OpenGL.GLUT import *
  from OpenGL.GL import *
  from OpenGL.GLU import *
except:
  print '''
ERROR: PyOpenGL not installed properly.  
        '''
  sys.exit()

spin = 0.0

def display():
   glClear(GL_COLOR_BUFFER_BIT)
   glPushMatrix()	# Save original matrix before rotating
   glRotatef(spin, 0.0, 0.0, 1.0)
   glColor3f(1.0, 1.0, 1.0)
   glRectf(-25.0, -25.0, 25.0, 25.0)
   glPopMatrix()		# Reload original matrix as starting point for rotation
   glutSwapBuffers()

def spinDisplay():
   global spin
   spin = spin + 0.1
   if(spin > 360.0):
      spin = spin - 360.0
   glutPostRedisplay()	# Will cause callback "display" to be called

def init():
   glClearColor(0.0, 0.0, 0.0, 0.0)
   glShadeModel(GL_FLAT)

def reshape(w, h):
   glViewport(0, 0, w, h)
   glMatrixMode(GL_PROJECTION)
   glLoadIdentity()
   glOrtho(-50.0, 50.0, -50.0, 50.0, -1.0, 1.0)	# Determines clipping planes: left, right, bottom, top, near, far
   glMatrixMode(GL_MODELVIEW)
   glLoadIdentity()

def mouse(button, state, x, y):
   if button == GLUT_LEFT_BUTTON:
       if(state == GLUT_DOWN):
          glutIdleFunc(spinDisplay)
   elif button == GLUT_MIDDLE_BUTTON or button == GLUT_RIGHT_BUTTON:
       if(state == GLUT_DOWN):
           glutIdleFunc(None)
   

#  Request double buffer display mode.
#  Register mouse input callback functions
glutInit(sys.argv)
glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB)
glutInitWindowSize(250, 250)
glutInitWindowPosition(100, 100)
glutCreateWindow('Double')
init()
glutDisplayFunc(display)
glutReshapeFunc(reshape)
glutMouseFunc(mouse)
glutMainLoop()


