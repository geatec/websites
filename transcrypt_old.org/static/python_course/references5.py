# Don't want to use return?

l = [2, 20]
print ('Before call, global l =', l)

def f (m):
	m [0] += 1
	m [1] += 1
	
f (l)
print ('After call, global l =', l)
