#include <iostream>
#include <fstream> 
using namespace std;

// opgave 11.1 

   
  
int main()  
{ char c, ch; 
  int n;
    ifstream ff("aa.txt");
    if (!ff)
     { cout << "kan niet openen aa.txt"<< endl; return 1;}
    ofstream gg("bb.txt");
    if (!ff)
     { cout << "kan niet openen bb.txt"<< endl; return 1;}   
         n=0;
         while (ff.get(ch)) 
           { if (isupper(ch)) 
                 { c=tolower(ch); ch=c; n++;}    
             gg.put(ch);    
           } 
 cout << n<< endl;
 cin >> c;                                
 return 0;     
}
