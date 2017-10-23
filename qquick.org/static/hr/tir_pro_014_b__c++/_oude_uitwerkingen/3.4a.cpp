#include <iostream>
using namespace std;

// opg 3.4 

int main()
{ unsigned short int i=0,a,c,d,e,bit0,bit1,bit2,bit3,bit4,bit5,bit6,bit7,wissel;   
  bool b=false ;
  
  cin >> hex >> i ;
  c = i & 0x00FF ;   // alleen bit 0-7 
   
  bit0  = c & 0x0001 ;   //  bit 0 
  bit1  = c & 0x0002 ;   //  bit 1 
  bit2  = c & 0x0004 ;   //  bit 2  
  bit3  = c & 0x0008 ;   //  bit 3   
  bit4  = c & 0x0010 ;   //  bit 4 
  bit5  = c & 0x0020 ;   //  bit 5 
  bit6  = c & 0x0040 ;   //  bit 6  
  bit7  = c & 0x0080 ;   //  bit 7   
  
/*  wissel= bit0;
  if (bit7   == 0)  bit0= 0x0000; else bit0 = 0x0001;
  if (wissel == 0)  bit7= 0x0000; else bit7 = 0x0080;
   
  wissel= bit1;
  if (bit6   == 0)  bit1= 0x0000; else bit1 = 0x0002;
  if (wissel == 0)  bit6= 0x0000; else bit6 = 0x0040;
  
  wissel= bit2;
  if (bit5   == 0)  bit2= 0x0000; else bit2 = 0x0004;
  if (wissel == 0)  bit5= 0x0000; else bit5 = 0x0020;
  
  wissel= bit3;
  if (bit4   == 0)  bit3= 0x0000; else bit3 = 0x0008;
  if (wissel == 0)  bit4= 0x0000; else bit4 = 0x0010;
*/  
  d= 0x0000;
//  d = bit0 | bit1 | bit2 | bit3 |bit4 | bit5 | bit6 | bit7 ; // bits 0-7 verwisseld
   d = bit0 | bit1 | bit2 | bit3 |bit4 | bit5 | bit6 | bit7 ; // bits 0-7 verwisseld
  e = i & 0xFF00;    // bits 8-16
  i = d | e ;        // bits 0-16 
  
  cout << "0x" << hex << i << endl;
  system("pause");
  return 0;
     
}
