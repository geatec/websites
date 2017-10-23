#include <iostream>
#include <fstream>
#include <string>

using namespace std; 

// opg 8.1
 
int main()
 {  char ch,c;
    char  str[80],savestr[80];
    int aantal=0;  
    ifstream ff("tekstfile.txt");
    if (!ff) { cout << "kan tekstfile niet openen.\n"; return 1;}
        while ( ff.getline(str,80))
        { if ( strlen(str)> aantal)
          { strcpy(savestr,str); aantal=strlen(str);  }
      }    
      cout << savestr << endl;
     cin >> c;
   return 0;
  }
