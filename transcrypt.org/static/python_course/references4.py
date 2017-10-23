# Changing params Python style

x, y = 2, 20
print ('Before call, global x, y =', x, y)

def f (a, b):
	a += 1
	b += 1
	return a, b
	
x, y = f (x, y)
print ('After call, global x, y =', x, y)
