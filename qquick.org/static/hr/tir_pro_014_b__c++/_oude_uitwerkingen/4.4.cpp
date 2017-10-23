#include <iostream>
using namespace std;

// opg 4.4
// ggd.cpp: ggd bepalen
// recursieve functie.

int ggd(int a, int b)   
{ if (b==0) return a; else return ggd(b, a%b); }


int main() 
{	int x,y,z;
cout << "Geef positief geheel getal x:  "; cin >>x;
cout << "Geef positief geheel getal y:  "; cin >>y;

z= ggd(x,y);
cout << "resultaat  "<< z << endl;

system("pause");
return 0;
}











