#include <iostream>

using namespace std;

// opg 5.2a

int main()
  // afsluitO.cpp: Niet-numerieke afsluitcode; // voorlopige versie.
{    int teller,i, x ,vorige ,a[10];
     i=1;
     cout <<"Tik getallen in, gescheiden door spaties,\n"
          <<"met een regel tekst na het laatste getal:\n";
     while (cin >> x)  { vorige = x; a[0]=vorige; teller=1;}
     cin.clear();
     cin.ignore(100, '\n');
     while (cin >> x)  
       { if (vorige!=x) 
           { a[i]=x;  teller=teller+1; i=i+1;  if (teller >10) break; } 
     }     
     cin.clear();
     cin.ignore(100, '\n');
     cout << "Aantal ongelijke getallen: " << i << endl;
     system("pause");
     return 0;
  
   
}
