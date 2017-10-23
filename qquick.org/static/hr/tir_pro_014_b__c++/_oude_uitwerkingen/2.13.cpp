#include <iostream>
#include <iomanip>


// Opgave 2.13

using namespace std;

float macht(float x, int n)
  { float r; int i;
      r = 1;
      for (i=0; i<n; i++)
      r *= x;
     return r;
  }
  
int main()
{ float x,r;
  int n,i ; x=10;
  cin >> n;
  for (i=0; i<n; i++)
    { r= macht(x,i);
       cout << setw(10) <<i <<setw(10) << r << endl; 
    }
  //system("Pause");
}
