# With simple variables, assignment behaves as expected
# Needless copying is prevented transparently

print ('\nSimple assignment')
a = 3
b = 4
print (a, b)

print ('\nTuple assignment')
c, d = 5, 6
print (c, d)

print ('\nNo temporary vars needed for a swap or permutation')
print (a, b, c, d)
a, b, c, d = d, c, b, a
print (a, b, c, d)
