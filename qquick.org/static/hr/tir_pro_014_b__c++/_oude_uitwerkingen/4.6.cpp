#include <iostream>
using namespace std;

// opg 4.6


int main()
{ unsigned short int i=0,a,c,d,e,f;   
  unsigned short int  bit03,bit47, bit07;
  bool b=false ;
  unsigned char ch='A';
  cin >> i ;            //12345 2 bytes max 2^16 ongeveer 640000
  d= i % 10 ;         // d = laatste decimaal d=0005
  e = (i -d)/10 ;    
  f = e % 10;         // f = een na laatste decimaal f=0004
  cout << d << endl;
  
  cout << f << endl;
  
  c = d & 0x000F ;   // alleen bit 0-3 van laatste decimaal 
  e = f & 0x000F;    // alleen bit 0-3 van een na laatste decimaal
  
  cout << "0x" << hex << c << endl;
  cout << "0x" << hex << e << endl;
  
  bit03= c & 0x000f ;    // laatste 4 bit  bit 0-3 laatste decimaal 
  bit47= e << 4 ;        //  4 bit naar links schuiven bit 4-7 van een na laatste decimaal
  bit07 = bit03 | bit47; // samenvoegen bit 0 - 7 
  
  cout << bit03 << endl;  //decimaal 
  cout << bit47 << endl;  //decimaal
  cout << bit07 << endl; //decimaal
  ch = char(bit07);
  cout << ch << endl;    // ASCII
  
  cin >> a;
  return 0;
     
}
