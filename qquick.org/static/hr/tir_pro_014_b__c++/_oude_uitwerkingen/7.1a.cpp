#include <iostream>
using namespace std; 

// opg 7.1a oplossing met integer 


class tijd  
{ public:
    tijd(int h=0 , int m=0) {hhh=h; mmm=m;} 
    void printtime();
    void gettime(int &h, int &m);
  private:
     int hhh,mmm;      
};
  
  void tijd :: printtime()
   { cout << hhh << "." << mmm << endl;}
     
  void tijd :: gettime( int &h , int &m)
   { h=hhh; m=mmm; } 
    
  tijd operator+(tijd &a ,int b)
  {int ha , ma , hb ,mb ,xa,xb ,xt,hx, mx;
   a.gettime(ha,ma);  
   xa=ha*60 + ma ; xb =b;
   xt = xa + xb ;
   mx=xt%60; hx= xt/60;   
   if ( mx >=60) { mx=mx-60; hx=hx+1;}
     if ( hx >= 24 ) { hx=hx-24 ;}
   return tijd(hx,mx);
}     
   
int main()
 { tijd u(23,59) , v(00,10) , s;
    int c;  
    u.printtime();
    v.printtime();
    s.printtime();
    s = u + 100;
    s.printtime();
     cin >> c;
   return 0;
     
  }
