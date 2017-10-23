from OpenGL.GL import *
from OpenGL.GLUT import *
from OpenGL.GLU import *
 
import random
 
def rand():
	return random.randint (0, 100)/100.
 
def initFunc():
	glClearColor(0.0, 0.0, 0.0, 0.0);
	glClear(GL_COLOR_BUFFER_BIT);
	glColor(1.0, 1.0, 1.0);
	glOrtho(0.0, 1.0, 0.0, 1.0, -1.0, 1.0);    

def displayFunc():
	glutSolidSphere(0.5, 100, 100)
	glFlush()
 
def keyboardFunc(key, x, y):
	glColor(rand(), rand(), rand())
	displayFunc()

def mouseFunc(button, state, x, y):
	glClearColor(rand(), rand(), rand(), 0.0)
	glClear(GL_COLOR_BUFFER_BIT);
	
if __name__ == '__main__':
	glutInit()
	glutInitWindowSize(640,480)
	glutCreateWindow("Colored sphere")
	glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB)
	glutDisplayFunc(displayFunc)
	glutKeyboardFunc(keyboardFunc)
	glutMouseFunc(mouseFunc)
	initFunc()
	glutMainLoop()