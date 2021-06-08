print ('\nThe most important things you can do with dictionaries:')

d1 = {'brown':'john', 'white':'mary', 'blue':'babe'}
print
print ('The dictionary :', d1, 'Length is', len (d1))
print ('Its class      :', d1.__class__)

secondName = 'white'
print
print ('Second name    : ' + secondName)
print ('First name     : ' + d1 [secondName])

print ('\nA dict itself is no sequence but its keys are!')
for k in sorted (d1.keys ()):
	print (k + ',', d1 [k])
	
print ('\nDicts are mutable')
d1 ['white'] = 'jane'
print (d1)
del d1 ['brown']
print (d1)

print ('\nDicts are polymorphic and nestable')
d2 = {
	0 : 'null',
	'one' : {
		False : 'nothing',
		True : 'more than nothing',
		(0, 1) : ['one', 'two'],
		(1, 0) : {'x' : 100, 'y' : 200}
	}
}

print (d2)
print (d2 [0])
print (d2 ['one'] [(0, 1)] [1])




