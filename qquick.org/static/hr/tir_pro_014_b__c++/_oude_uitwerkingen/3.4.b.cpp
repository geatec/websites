#include <iostream>
using namespace std;

int main()
{  
unsigned int x, linkerdeel, y=0, i;
cout << "Voer een Hexadeximaal in (a5f0): ";
cin >> hex >> x;
linkerdeel = x & ~0xFF;
for (i=0; i<8; i++)
{  
y <<= 1;     // Schuif y een positie naar links
y |= x & 1;  // Breng de meest rechtse bit van x over naar y
x >>= 1;     // Schuif x een positie naar rechts
}
y |= linkerdeel;
cout << "Na de verwisselingen in de rechter 8 bits krijgen we " << hex << y << " (hex).\n";
system("PAUSE");
return 0;
}

