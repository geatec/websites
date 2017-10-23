#include <iostream>
using namespace std; 

// opg 6.2

void wissel(string  &x , string &y)
  { string h ;
      h=x ; x=y ; y=h;
  }  

void sorteer3strings(string &s, string &t, string &u)
   { if ( s > t ) wissel(s,t);
     if ( t > u ) wissel(t,u);
     if ( s > t ) wissel(s,t);
    }   
int main()
 { string  s,t,u;
   int c ;
    cin >> s >> t >> u ;
    sorteer3strings(s,t,u);
    cout << s <<" "<<  t << " "<< u << endl;     


  cin >> c;
  return 0;
     
}
