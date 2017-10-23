#include <iostream>
#include <iomanip>
#include <fstream> 
using namespace std;

// opgave 8.8 

   
  
int main()  
{ char c,ch; 
    cout << endl;
    cout << "Dec Hex   Ascii" << endl;
    cout << endl;
    ifstream ff("c:\\aa.txt",ios::binary);
    if (!ff)
     { cout << "kan niet openen aa.txt"<< endl;system("pause"); return 1;}
    ofstream gg("bb.txt");
    if (!gg)
     { cout << "kan niet openen bb.txt"<< endl;system("pause"); return 1;}   
            
       while (ff.get(ch)) 
         {cout << left  << dec << setw(4) <<  int(ch) ;
          cout << left << hex << setw(4) << showbase << int(ch) ;
       if (ch!= 10) {cout << right << dec << setw(3)<< char(ch);}
         cout << endl;
         }   system("pause");             
     cin >> c;                           
  return 0;     
}
