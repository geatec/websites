/*#include <iostream>
using namespace std; 

// opg 7.1 oplossing met 2 tijden optellen 


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
    
  tijd operator+(tijd &a ,tijd &b)
  {
      int ha, ma, hb, mb ,xa, xb ,xt, hx, mx;
      
      a.gettime(ha,ma);
      b.gettime(hb,mb);
      
      xa=ha*60 + ma ;
      xb =hb*60 + mb;
      
      xt = xa + xb ;
      
      mx=xt%60;
      hx= xt/60;
   
      if ( mx >=60)
      {
          mx=mx-60;
          hx=hx+1;
      }
     
      if ( hx >= 24 )
      {
          hx=hx-24 ;
      }
      
   return tijd(hx,mx);
}     
   
int main()
 { tijd u(13,59) , v(00,10) , s;
    int c;  
    u.printtime();
    v.printtime();
    s.printtime();
    s = u + v;
    s.printtime();
     cin >> c;
   return 0;
     
  }
*/

#include <iostream>
using namespace std;
class tijd
{
private:
    int hours, minutes;
public:
    tijd(int hours=0, int minutes=0)
    {
        if(hours>=24)
        {
            hours -= 24;
        }
        this->hours = hours;
        if(minutes>=60)
        {
            minutes -= 60;
        }
        this->minutes = minutes;
    };
    
    tijd()
    {
        hours = 0, minutes = 0;
    };
    
    int getHours(){return hours;};
    int getMinutes(){return minutes;};
    void setHours(int newHours){hours = newHours;};
    void setMinutes(int newMinutes){minutes = newMinutes;};
    void printTime(){cout << hours << "." << minutes << endl;};
    tijd operator+(tijd &t1,tijd &t2)
    {
        if(t1.getHours() + t2.getHours() >= 24)
        {
            t1.setHours(t1.getHours()-24);
        }
        if(t1.getMinutes() + t2.getMinutes() >= 60)
        {
            t1.setHours(t1.getHours()+1);
            t1.setMinutes(t1.getMinutes()-60);
        }
        return tijd(t1.getHours() + t2.getHours(), t1.getMinutes() + t2.getMinutes());
    }
    tijd operator+(tijd &t1, int n)
    {
        while(n>=60)
        {
            t1.setHours(t1.getHours()+1);
            n -= 60;
        }
        return tijd(t1.getHours(), t1.getMinutes()+n);
    }
    int main()
    {
        tijd t1(23, 59), t2(2, 6), tTemp(0,0);
        t1.printTime();
        t2.printTime();
        cout << "t1 + t2 geeft: " << endl;
        tTemp = t1 + t2;
        tTemp.printTime();
        cout << "123 minuten optellen bij t2 geeft: " << endl;
        t2 = t2 + 123;
        t2.printTime();
        system("pause");
        return 0;
    }
