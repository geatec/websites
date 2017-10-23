#include <iostream>
using namespace std; 

// opg 9.3 werkt zonder friend 

template <class T>
class vec {
    public:
    vec(T  xx=0, T  yy=0 ) {T x=xx; T y=yy;}
    void printvec() ; 
    vec<T> operator+(vec<T> &a )
    { return  vec<T>(x+ a.x    , y + a.y    ); }   
    private:
    T  x , y ; 
};
     
template <class T> 
void vec<T>  :: printvec()
   { cout << x  <<"  " << y  << endl;}
   


main()
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


