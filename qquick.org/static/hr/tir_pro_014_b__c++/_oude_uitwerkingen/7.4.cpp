#include <iostream>
using namespace std;

// opgave 7.4 

  class linv {
   public: linv(double aa1 , double bb1, double cc1 ,double aa2, double bb2, double cc2)
       { a1=aa1; b1 =bb1; c1=cc1; a2=aa2; b2=bb2;  c2=cc2; }
   bool Losop();
   double oplx()   const { return x;}
   double oply()   const { return y;}
  private: double a1,a2,b1,b2,c1,c2,x,y;
};
  

 bool linv:: Losop()
  { double d= a1*b2 - a2*b1;
     if (d == 0) throw 123 ;
     x= (b2*c1-b1*c2) / d ;
     y= (a1*c2-a2*c1) / d ;
     return true;
  }
  
int main()  
{ int c;
  double a1,a2,b1,b2,c1,c2;
cout << "geef a1, b1,c1 ,a2,b2 ,c2" << endl;
cin >> a1 >>b1 >> c1 >>  a2 >> b2>> c2;
linv v(a1, b1 ,c1 ,a2, b2, c2);

 try  { v.Losop();}
 catch (int i)  { cout << i  << "  Fout einde " << endl;  cin >> c ; return 0;}
  cout << v.oplx() << " "<< v.oply() << " Opgelost " << endl;
  cin >> c;
  return 0;
     
}
