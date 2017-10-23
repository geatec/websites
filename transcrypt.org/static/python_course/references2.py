# Lists (and in general, mutable containers) are a bit trickier

print ('\nInstantiation and assignment')
a = [1, 2]
print (a)

print ('\nCopying the reference')
b = a
print (a, b)

print ('\nTwo references to the same list, rather than independent lists')
b [0] = -1
print (a, b)

print ('\nAssigning a new, independent list')
b = [10, 20]
print (a, b)

print ('\nAnother instantiation and assignment')
x = [100, 200]
print (x)

print ('\nCopying the value, rather than the reference')
y = x [:]
print (x, y)

print ('\nTwo independent lists are the result')
y [0] = -100
print (x, y)




