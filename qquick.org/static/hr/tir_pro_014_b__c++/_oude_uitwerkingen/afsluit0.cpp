#include <iostream>

using namespace std;

// opg 5.2a

int main()
  // afsluitO.cpp: Niet-numerieke afsluitcode; // voorlopige versie.
{    double s=0, x;
     cout <<"Tik getallen in, gescheiden door spaties,\n"
          <<"met een regel tekst na het laatste getal:\n";
     while (cin >> x)  s += x;
     cin.clear();
     cin.ignore(100, '\n');
     cout << "De eerste som is " << s << endl;
     system("pause");
     return 0;
  
   
}
