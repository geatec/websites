#include <iostream>
using namespace std; 

// opg 9.1

template <class T>  
void volgorde3(T &s, T &t, T &u)
   { if ( s > t ) wissel(s,t);
     if ( t > u ) wissel(t,u);
     if ( s > t ) wissel(s,t);
    }   

template <class R >
void wissel(R &x , R &y)
   { R h ;
       h=x ; x=y ; y=h;
   }   

int main()
 { string  s,t,u;
   double  x,y,z;
   int c;
    cin >> x >> y >> z ;
    cin >> s >> t >> u ;
    volgorde3(x,y,z);
    cout << x <<endl<< y <<endl<< z <<endl;    
    volgorde3(s,t,u);
    cout << s <<endl<< t <<endl<< u <<endl;        
    cin >> c;
   return 0;
     
  }
