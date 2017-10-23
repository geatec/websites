#include <iostream>
using namespace std;

// opgave 3.3

int main()
{ short int i=0 ,a,c,d,e;   
  bool b=false ;
  cin >>  i ;
  if ( i < 0 ) { i=-i ; b = true;}
     c = i << 2 ;  // i *  4  2^2
     d = i << 5;   // i * 32  2^5
     e = i << 6;   // i * 64  2^6
     i = c+ d + e  ; // i := 4*i + 32*i + 64* i = 100i
  if (b==true) i=-i ;
  cout << i << endl;
  system("pause");
  return 0;
     
}
