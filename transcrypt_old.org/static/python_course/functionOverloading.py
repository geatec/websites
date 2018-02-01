print ('In Python, function overloading can only be faked by \'run time\' type discrimination.')
print ('There\'s no such thing as a \'compile time\' type discrimination, since there is no \'compile time\'...')
print ('Seen from the caller side, there\'s no difference, so it is possible to properly dispatch calls to overloaded C++ implementations.')
print ('This means that you\'re still able to wrap your C++ code without manual \'name mangling\'.')
print

def inverse (a):
	if a.__class__ == str:
		return a [::-1]
	elif a.__class__ in [float, int]:
		return 1. / a
	elif a.__class__ == bool:
		return not a
	else:
		raise
		
for o in ['I prefer Pi', object (), 3, 3.14, True]:
	try:
		print (inverse (o))
	except:
		print ('Can\'t invert', o)


		
		