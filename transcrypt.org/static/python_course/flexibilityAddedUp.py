print ('Try this in your favorite compiled language...')


def select (sequence, criterion):
	return [item for item in sequence if criterion (item)]


print ('\nSimple case')

Numbers = range (20)

print (select (Numbers, lambda item: item % 2 == 0))


print ('\nLess simple case')

Valuables = ('silver', 'gold', 'platinum', 'perls', 'diamonds')
Snakes = ('rattleSnake', 'cobra', 'boa constrictor')

CrateOfBags = [
		('rattleSnake', 'silver', 'gold'),
		('gold', 'diamonds'),
		('diamonds', 'cobra'),
		('silver', 'platinum', 'perls'),
		('mud', 'dead leaves'),
		('sand', 'shells', 'tin cans')
	]
	
print (select (CrateOfBags, lambda bag:	len (set (bag) & set (Valuables)) > 0 and len (set (bag) & set (Snakes)) == 0))
