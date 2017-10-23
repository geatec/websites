#include <iostream>
using namespace std; 

// opg 9.1

template <class T>
void wissel(T &x , T &y)
  { T h ;
      h=x ; x=y ; y=h;
  }  

 
   
int main()
 { string s,t ;
   int c , i,j ;
    cin >> s >> t  ;
    wissel(s,t);
    cout << s<<"  "<<t<<"  " << endl;  
      cin >> i >> j ;
    wissel(i,j);
    cout <<i <<"  "<< j<< "  " << endl;       
    cin >> c;
   return 0;
     
  }
