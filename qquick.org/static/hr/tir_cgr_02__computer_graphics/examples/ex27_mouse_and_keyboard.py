from OpenGL.GL import *
from OpenGL.GLUT import *
from OpenGL.GLU import *
from random import *
 
seed ()
 
xS, yS = 0, 0 
 
def initFun():
	glClearColor(0.0, 0.0, 0.0, 0.0);
	glClear(GL_COLOR_BUFFER_BIT);
	glColor(1.0, 1.0, 1.0);
	glOrtho(0.0, 1.0, 0.0, 1.0, -1.0, 1.0);    

def displayFun():
	glColor (random(), random(), random())
	glBegin(GL_POLYGON);
	glVertex3d(0.25, 0.25, 2);
	glVertex3d(0.75, 0.25, 0.0);
	glVertex3d(0.75, 0.75, 0.0);
	glVertex3d(0.25, 0.75, 0.0);
	glEnd();
	glFlush();
	
	glColor(1.0, 1.0, 1.0);
	glPushMatrix()
	print '>>>', xS, yS
	glTranslatef(xS / 1000., 1-yS / 1000., -0.1)
	glutSolidSphere (0.1, 50, 50)
	glPopMatrix()


	

 
def keyboardFun(key, x, y):
	global xS
	xS = x
	global yS
	yS = y
	print xS, yS
	glutPostRedisplay()
 
if __name__ == '__main__':
	glutInit()
	glutInitWindowSize(640,480)
	glutCreateWindow("B&W rectangle")
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB)
	glutDisplayFunc(displayFun)
	glutKeyboardFunc(keyboardFun)
	initFun()
	glutMainLoop()