#include <iostream>
#include <fstream> 
using namespace std;

// opgave 8.3 

   
  
int main()  
{ char c,ch; 
    ifstream ff("aa.txt");
    if (!ff)
     { cout << "kan niet openen aa.txt"<< endl; return 1;}
    ofstream gg("bb.txt");
    if (!ff)
     { cout << "kan niet openen bb.txt"<< endl; return 1;}   
         while (ff.get(ch)) 
           { gg.put(ch) ; if (ch == ',')     
                { if (ff.get(ch) == 0){ return 1 ;} else 
                 { if (ch != ' ') { gg.put(' ');}    
                 gg.put(ch) ; if (ch == ',' ) gg.put(' ') ; }
           }    
      }                    
                                
  return 0;     
}
