# for

print ('\nC-like')
for i in [1, 2, 3]:
	print (i)

print ('\nPolymorphic')
for x in ['aap', 3, [5, 6, 7]]:
	print (x)

print ('\nRanges')
print (range (10))
print (range (3, 10))
print (range (1, 100, 10))

print ('\nIteration over a range')
for i in range (20):
	print (i,)
print
	
print ('\nGetting the index')
for i, s in enumerate (['moon', 'rose', 'fish']):
	print (i, s)
	
print ('\nLinear search')
def find (aRange, aNumber):	# Using return instead of break and else would have had the same effect, but that's not the point here
	for i in aRange:
		if i == aNumber:
			print (aNumber, 'found in', aRange)
			break
	else: 
		print (aNumber, 'not found in ', aRange)

find (range (0, 10), 5)
find (range (10, 20), 5)

print ('\nSkipping an iteration')
for i in range (10):
	if i == 5:
		continue
	print (i,)
print

