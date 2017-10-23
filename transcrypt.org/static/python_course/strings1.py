# Strings are immutable sequences

greyAnimal = 'elephant'
greenAnimal = 'aligator'

print ('\nNatures job:')
print (greyAnimal)
print (greenAnimal)

greyHead = greyAnimal [:3]
greyTail = greyAnimal [3:]

greenHead = greenAnimal [:3]
greenTail = greenAnimal [3:]

biteThumper = greenHead + greyTail

trunkCrawler = greyHead
trunkCrawler += greenTail

print ('\nAfter some manipulation:')
print (biteThumper)
print (trunkCrawler)

print ('\nThe', greenAnimal, 'converted to a list of chars:')
greenAnimalChars = list (greenAnimal)
print (greenAnimalChars)

print ('\nThe list reversed:')
greenAnimalChars.reverse ()
print (greenAnimalChars)

print ('\nReassembled into a string:')
greenAnimalReversed = ''.join (greenAnimalChars)
print ('In Brazil an', greenAnimal, 'is called a', greenAnimalReversed)

print ("\nReplace substring 'a' by substring 'i':")
greenAnimalReversedPlural = greenAnimalReversed.replace ('a', 'i')
print ('The plural is', greenAnimalReversedPlural)

print ('\nThere are many handy member functions: (tip of the iceberg)')
windowsPath = r'C:\MyDocs\MyText.doc'
print ('Windows path:', windowsPath)
linuxPath = windowsPath.replace ('\\', '/')
print ('Linux path  :', linuxPath)

print ('\nAlso for formatting:')
from math import *
print ('Usally pi is trunctated to %0.2f and e is truncated to %0.2f' % (pi, e))

print ('\nYou can get quite clever with formatting: (tip of another iceberg)')
nix = 0
weird = 'lollapalooza'
print ('X = %(nix)d  Word = %(weird)s' % vars ())

print ('\nAllthough it can be overkill...')
print ('X =', nix, ' Word =', weird)