#include <iostream>
using namespace std;

// opg 4.3


// recursie.cpp: 	Analyse van een recursieve
// 		functie.
 #include <iostream>
 using namespace std;


void f(int n) 
{  if (n > 0)
      { f(n-2); cout<< n<<"   " ;  f(n-1);}
}

int main() 
{	int k,i;
cout << "Geef k:  "; cin >>k;
for (i=0; i< k ; i++)
{ cout << "Uitvoer k :   "; cout << i; cout << "   Functie k :    " ; f(i); cout << endl;}
 system("pause");
return 0;
}











