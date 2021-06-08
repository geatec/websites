x = 2
print ('Global x =', x)

def f (a):
	print ('Local a =', a, 'is reference to x since params are copied by reference')
	a += 1
	print ('Local a =', a, 'is reference to new memory location, x unaltered!')
	
f (x)
	
print ('Still, global x =', x)


	