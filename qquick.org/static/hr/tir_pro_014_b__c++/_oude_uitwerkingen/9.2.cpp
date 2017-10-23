#include <iostream>
#include <string>
using namespace std; 

// opg 9.2


template < class T>
class vect{
    public:
        vect(){lengte=gereserveerd=0; start=NULL;}
        vect(const vect<T>  &u);
        ~vect() {delete[] start;}
        vect &operator=(const vect<T> &u);
        void push_back( int x);
        void push_back(float s);
        int &operator[](int i) { return start[i];}
        int size() { return lengte;}
    private:
        int *start ,lengte ,gereserveerd;
        void kopieer(const int *p);
    };

template <class T>
    vect <T> ::vect (const vect <T> &u)
    {   lengte= u.lengte;
        gereserveerd= u.gereserveerd;
        kopieer(u.start);
    }
    
template <class T>
    vect <T> &vect <T> ::operator=(const vect <T> &u)
    { if (this != &u)
        { delete[] start;
            gereserveerd = u.gereserveerd;
            lengte=u.lengte;
            kopieer(u.start);
         }
      return *this;
    }
template <class T>
    void vect <T>::push_back(int x)
    { if (gereserveerd == 0)
        { gereserveerd = 1;
          lengte = 0; //wordt straks 1
          start = new int[gereserveerd];       
        }    
       else 
       if (lengte== gereserveerd)
        { gereserveerd *=2;
          int *p = start;
          kopieer(p) ; // van p naar nieuwe rij start
          delete[] p; //verwijder ouse rij        
         }    
      start[lengte++]= x;
     }    
template <class T>
    void vect <T>::push_back( float y)
    { if (gereserveerd == 0)
        { gereserveerd = 1;
          lengte = 0; //wordt straks 1
          start = new float[gereserveerd];       
        }    
       else 
       if (lengte== gereserveerd)
        { gereserveerd *=2;
          float   *p = start;
          kopieer(p) ; // van p naar nieuwe rij start
          delete[] p; //verwijder ouse rij        
         }    
      start[lengte++]= y;
     }    
     
  template <class T>  
     void vect <T>::kopieer(const int *p)
     { start=new int[gereserveerd];
       for (int i=0; i < lengte; i++) start[i] = p[i];
     }
     
   int main()
     { int c; 
     vect<int> u;       
     u.push_back(123);
     vect<float> v; 
     v.push_back(int(12.34));  //: 123 456
   //  v=u; // aanroep assignment operator
     //v[1] = 999; //   inhoud v: 123 999
     vect <int> w(u);   // aanroep copy-constructor
    int i;
    for ( i=2 ; i < 10; i++ ) u.push_back(10 * i );
       // u: 123 456 20 30 40 50 60 70 80 90
    cout << "u: " ;
    for ( i=0 ; i < u.size(); i++ )  cout << u[i] << " ";
    cout << "\nv: " ;  // v: 123 999
    for ( i=0 ; i < v.size(); i++ )  cout << v[i] << " ";
    cout << "\nw: " ;  // w: 123 456 
    for ( i=0 ; i < w.size(); i++ )  cout << w[i] << " ";
    cout << endl;
    cin >> i;
    return 0;
}    

 
