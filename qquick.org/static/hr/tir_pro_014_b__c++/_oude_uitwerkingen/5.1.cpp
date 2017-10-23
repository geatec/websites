/*#include <iostream>
using namespace std;

// opg 5.1

int main()
{
    int dag,maand,jaar,a, dagnummer,totaal,i,maandnummer[13];
  
      cin >>  dag >> maand >> jaar; // dag maand jaar in 07 02 1948 
      maandnummer[1]=31;
      maandnummer[2]=28; 
      maandnummer[3]=31; 
      maandnummer[4]=30; 
      maandnummer[5]=31;
      maandnummer[6]=30;
      maandnummer[7]=31;
      maandnummer[8]=31;
      maandnummer[9]=30;
      maandnummer[10]=31;
      maandnummer[11]=30;
      maandnummer[12]=31;
      
   cout << dag << " " << maand << " " << jaar << endl;
  
    if(jaar %400 == 0 || (jaar % 4 == 0 && jaar % 100 != 0))
    {
        maandnummer[2] = 29;
    }
  
  i=1; totaal=0; 
  while (i < maand) { totaal=totaal + maandnummer[i]; i++; }
   dagnummer=  totaal + dag ;
  cout << dagnummer << endl; // print het dagnummer uit = 38
  
  cin >> a;
  return 0;
     
}*/