from OpenGL.GL import *
from OpenGL.GLUT import *
from OpenGL.GLU import *
 
import random
 
def initFun():
	glClearColor(0.0, 0.0, 0.0, 0.0);
	glClear(GL_COLOR_BUFFER_BIT);
	glColor(1.0, 1.0, 1.0);
	glOrtho(0.0, 1.0, 0.0, 1.0, -1.0, 1.0);    

def displayFun():
	glBegin(GL_POLYGON);
	glVertex(0.25, 0.25, 0.0);
	glVertex(0.75, 0.25, 0.0);
	glVertex(0.75, 0.75, 0.0);
	glVertex(0.25, 0.75, 0.0);
	glEnd();
	
	glFlush();
 
if __name__ == '__main__':
	glutInit()
	glutInitWindowSize(640,480)
	glutCreateWindow("B&W rectangle")
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB)
	glutDisplayFunc(displayFun)
	initFun()
	glutMainLoop()