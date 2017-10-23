#include <iostream>
using namespace std;

// opg 4.4.1
// ggd1.cpp: ggd bepalen
// iteratieve functie.


int ggd1(int a, int b)
{int c;
while ( b!=0) {  c=a%b;  a=b; b=c;}
c=a; return a;
}
 
int main() 
{	int x,y,z;
cout << "Geef positief geheel getal x:  "; cin >>x;
cout << "Geef positief geheel getal y:  "; cin >>y;

z=ggd1(x,y);
cout << "resultaat  "<< z << endl;

system("pause");
return 0;
}











