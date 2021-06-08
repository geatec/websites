print ('\nThe most important things you can do with lists:')

print ('\nDatastructures are generally polymorphic, nestable, initializable by literals and printable')
l1 = ['flower', 6, [None, [True, False], 3.5]]
print (l1, 'Length is', len (l1))

print ('\nLists are mutable sequence types (and Python is garbage collected)')
l1 [2] = 7
print (l1 )

print ('\nAppend')
l1.append ('appendix2')
print (l1)

print ('\nExtend')
l1.extend (['extension1', 'extension2'])
print (l1)

print ('\nProbably not what was meant')
l1.extend ('appendix2')
print (l1)

print ('\nProbably this wasn\'t meant either')
l1.append (['extension3', 'extension4', 'extension5'])
print (l1)

a = 10
b = 9
c = 8

print ('\nReference in literal')
l2 = [a]
print (l2, a.__class__, b.__class__, l2.__class__)

print ('\n+ operator')
l2 = l2 + [b]
print (l2)

print ('\n+= operator')
l2 += [c]
print (l2)

print ('\nSorted')
l2.sort ()
print (l2)

print ('\nStrings, rather')
l3 = ['10', '9', '8']
print (l3)
 
print ('\nSorted \'appropriately\'')
l3.sort ()
print (l3)

print ('\nMembership testing')
print (9 in l2, 11 in l2)

print ('\nSlicing')
l4 = range (0, 100, 10)
print (l4)
l4 [2:5] = range (20, 50, 5)
print (l4)

print ('\nShrinking')
del l4 [3:8]
print (l4)
del l4 [1]
print (l4)
l4 [5:] = []
print (l4)
l4.remove (50)
print (l4)

print ('\n* operator')
l5 = range (3)
print (l5)
print (3 * (l5 + ['---']) + l5)

print ('\n*= operator')
l6 = range (2)
print (l6)
l6 *= 5
print (l6)

print ('\nList comprehensions')
print ([10 * i for i in range (10) if i % 2 == 0])

print ('can get incomprehensible...')
print ([str (j) + ' is a number' for j in [10 * i for i in range (10) if i % 2 == 0]])
