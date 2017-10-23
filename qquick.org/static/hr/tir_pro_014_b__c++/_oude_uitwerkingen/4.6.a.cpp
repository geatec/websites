#include <iostream>
using namespace std;



unsigned char bcd(int n){
    return (n / 10 ) % 10 << 4 | n % 10 ;
}    

int main()
{  
    int x;
    cin >> x;
    int resultaat = bcd(x);
    cout << hex << resultaat << endl;
    system("PAUSE");
    return 0;
}
