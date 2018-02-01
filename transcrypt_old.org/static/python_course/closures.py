print ('1. Don\'t need constructors of functors to pick up context state')
print ('2. Don\'t need C++ to write unreadable code')
print

def f ():
	pi = 3.14
	def g ():
		e = 2.74
		return lambda: (pi, e)
	return g
	
print (f () () ())
print

print ('Application: To obtain a callback without superfluous parameters, reduce number of params by picking up values from context closure')
