print ('Python supports functions with a variable number of parameters')
print

def printAboutAnything (*params):
	print ('Params: ',)
	if len (params):
		for param in params:
			print (param, param.__class__, ' ',)
	else:
		print ('None at all')

	print
		
printAboutAnything ('aap', 'noot', 'mies')
printAboutAnything (1, 'een', '1.0', True, None)
printAboutAnything ()
		