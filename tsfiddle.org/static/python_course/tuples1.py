# Tuples are immutable and light weight sequences

t1 = (1, 'bike', True)
print (t1, t1.__class__, len (t1))

try:
	t1 [1] = 'car'
	print ('\nNever here')
except:
	print ('\nDon\'t change me!!!')
	
t1 = t1 [0], 'car', t1 [2]	# Who needs braces...
print (t1, 'is a brand new tuple')

print ('\nThings IN a tuple may be mutable!')
t2 = (0, [1, 2])
print (t2)
t2 [1][1] = 'two'
print (t2)
 