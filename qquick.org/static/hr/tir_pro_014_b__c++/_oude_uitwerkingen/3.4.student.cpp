#include <iostream>

using namespace std;

int main()
{
    cout << "Enter a hexadecimal number\n";
    int in = 0x0;
    cin >> hex >> in;
    cout << in << endl;
    int out = 0x0;
    
    if (in & 0x01) {out |= 0x80; in -= 0x01;}
    if (in & 0x02) {out |= 0x40; in -= 0x02;}
    if (in & 0x04) {out |= 0x20; in -= 0x04;}
    if (in & 0x08) {out |= 0x10; in -= 0x08;}
    if (in & 0x10) {out |= 0x08; in -= 0x10;}
    if (in & 0x20) {out |= 0x04; in -= 0x20;}
    if (in & 0x40) {out |= 0x02; in -= 0x40;}
    if (in & 0x80) {out |= 0x01; in -= 0x80;}
    cout << "0x" << hex << in + out << endl;
    cin >> hex >> in;
}
