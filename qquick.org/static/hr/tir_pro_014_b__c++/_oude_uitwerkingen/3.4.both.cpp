// opgave 3.4

#include <iostream>
#include <bitset>  // stl klasse

using namespace std;

int main (){
          
     cout << "Voer een getal in: ";
     int a;
     cin >> hex >> a;
     cout << "Ingevoerde getal: " << a << endl;
     cout << "Hex van ingevoerde getal: " << hex << a << endl;

     int i = 1;
     bitset<16> x(a); 
     bitset<16> y(a);
     cout << "Bitset van ingevoerde getal: " << x << endl << endl;
     for (i = 0; i < x.size(); i++)
     {
          switch (i)
          {
                 case 0: y.set(7, x.test(i)); break;
                 case 1: y.set(6, x.test(i)); break;
                 case 2: y.set(5, x.test(i)); break;
                 case 3: y.set(4, x.test(i)); break;
                 case 4: y.set(3, x.test(i)); break;
                 case 5: y.set(2, x.test(i)); break;
                 case 6: y.set(1, x.test(i)); break;
                 case 7: y.set(0, x.test(i)); break;
                 
          }
     }
     
     cout << "Omgekeerde bitset: " << y << endl;
     cout << "Hex van omgekeerde bitset: " << hex << y.to_ulong() << endl;
     system("pause"); 
     
}
