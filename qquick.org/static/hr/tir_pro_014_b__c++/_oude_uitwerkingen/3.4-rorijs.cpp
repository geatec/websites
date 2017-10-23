#include <iostream>

using namespace std; 

int main(){
    int input;
    cout << "Enter a hex value: ";
    cin >> hex >> input;
    int x = input & 0xFF;
    int z = input & 0xFF00;
    
    int y = (((x << 7) & 0x80) | ((x >> 7) & 0x01));
    y += (((x << 5) & 0x40) | ((x >> 5) & 0x02));
    y += (((x << 3) & 0x20) | ((x >> 3) & 0x04));
    y += (((x << 1) & 0x10) | ((x >> 1) & 0x08));

    cout << hex << z+y << endl;
    
    system("Pause");
}

 




