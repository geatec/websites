# while

print (('\nBIG integers'))
i = 2
while i < 1e100:
	print (i)
	i *= i

print ('\nSkipping the else clause again')
i = 1
while i < 10:
	if i == 5:
		break
	i += 1
else:
	print ('Never here')

