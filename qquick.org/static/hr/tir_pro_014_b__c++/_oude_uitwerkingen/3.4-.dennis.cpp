//3.4 geheel getal binair omdraaien

#include <iostream>
using namespace std;

int main()
{
    int i;
    cout << "voor een hexadecimaal getal in: ";
    cin >> hex >> i;
    
    cout<<hex<<(i&0xff00)+((i&0x0080)>>7)+((i&0x0040)>>5)+((i&0x0020)>>3)+((i&0x0010)>>1)
    +((i&0x0008)<<1)+((i&0x0004)<<3)+((i&0x0002)<<5)+((i&0x0001)<<7) ;
    
    cin >> i;
}
