#include <iostream>
using namespace std; 

// opg 7.2


class breuk  
{ public:
    breuk (int teller=1 , int noemer=1) {t=teller; n=noemer;} 
    void printbreuk();
    void getbreuk(int &teller, int &noemer);
  private:
     int t,n;      
};
  
  void breuk :: printbreuk()
   { cout << t << "." << n << endl;}
     
  void breuk :: getbreuk( int &teller , int &noemer)
   { teller=t; noemer=n; } 
   
  int ggd(int a, int b) 
{ if (b==0) return a; else return ggd(b, a%b); }
  
  breuk operator *(breuk &a ,breuk &b)
  {int ta , na , tb ,nb ,xg ,tx, nx;
   a.getbreuk(ta,na); b.getbreuk(tb,nb); 
   tx= ta*tb ; nx=na*nb;
   xg=ggd(tx,nx);
   tx=tx/xg; nx=nx/xg;
    return breuk(tx,nx);
}     

 breuk operator /(breuk &a ,breuk &b)
  {int ta , na , tb ,nb ,xg ,tx, nx;
   a.getbreuk(ta,na); b.getbreuk(tb,nb); 
   tx= ta*nb ; nx=na*tb;
   xg=ggd(tx,nx);
   tx=tx/xg; nx=nx/xg;
    return breuk(tx,nx);
} 


 breuk operator +(breuk &a ,breuk &b)
  {int ta , na , tb ,nb ,xg ,tx, nx;
   a.getbreuk(ta,na); b.getbreuk(tb,nb); 
    nx= (na * nb)/(ggd(na,nb));
    tx= ta*nb + na*tb;
    xg=ggd(tx,nx);
    tx=tx/xg; nx=nx/xg;
    return breuk(tx,nx);
} 

breuk operator -(breuk &a ,breuk &b)
  {int ta , na , tb ,nb ,xg ,tx, nx;
   a.getbreuk(ta,na); b.getbreuk(tb,nb); 
    nx= (na * nb)/(ggd(na,nb));
    tx= ta*nb - na*tb;
    xg=ggd(tx,nx);
    tx=tx/xg; nx=nx/xg;
    return breuk(tx,nx);
}  
 
int main()
 { breuk u(5,7) , v(2,8) , s;
    int c;  
    u.printbreuk();
    v.printbreuk();
    s = u * v;
    s.printbreuk();
    s = u / v ;
    s.printbreuk();
    s = u + v ;
    s.printbreuk();
    s = u - v ;
    s.printbreuk();
     cin >> c;
   return 0;
     
  }
