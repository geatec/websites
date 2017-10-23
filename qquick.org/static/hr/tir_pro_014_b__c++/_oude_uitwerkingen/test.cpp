#include <iostream>
#include <fstream>

// opgave 1.1

using namespace std;
int main()
{ int a, leeftijd, geboortejaar;
    string s,p; 
     cin >> s ;
     p=s; 
     cout << s << endl; 
     cout <<p << endl;
      cin >> a;
     cin >> leeftijd;
     ofstream ff("test");
     putline(ff,s);
     
     return 0;
     
}
