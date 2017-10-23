#include <iostream>
using namespace std;

// opgave 2.2

int main()
{ int  aantal=0,c;
  float gemiddelde, x,som=0;
     cin >> x ;  
      while ( x > 0) { som+=x ; cin >> x; aantal++;}
      gemiddelde = som /aantal;
      cout << gemiddelde << endl;
      cin >> c;
    return 0;
     
}
