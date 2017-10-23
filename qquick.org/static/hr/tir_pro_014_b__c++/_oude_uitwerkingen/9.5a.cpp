#include <iostream>
using namespace std; 

// opg 9.5 werkt niet
// 10-6-2005 Werkt nu wel. [diepak]
///

//template<class T> class vec;
//template<class T> vec<T> operator+(const vec<T>& a,const vec<T>& b);

template <class T>
class vec {

public:
  vec(T  xx=0, T  yy=0 ) {  x=xx;   y=yy;}
  void printvec() ; 
  friend vec<T> operator+<>(const vec<T> &a,const vec<T>& b );
private:
  T  x , y ; 
};
     
template <class T> 
void vec<T>  :: printvec()
{
  cout << x  <<"  " << y  << endl;
}

template <class T>    
vec<T> operator+(const vec<T> &a,const vec<T>& b )
{ 
  return  vec<T>(a.x+ b.x, a.y + b.y    );
} 

int main()
{   vec <int>  iu(1,2),  iv(3,4) ,isom;
    int c;
    vec <float>  fu(1.1,2.2),  fv(3.3,4.4) , fsom;
    isom=iu + iv;
    fsom=fu + fv;
    isom.printvec();
    fsom.printvec();
    cin >> c;
    return 0;
 }


