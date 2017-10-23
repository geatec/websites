#include <iostream>
#include <climits>
using namespace std;

// opgave 2.5
int main()
{ int a,i ;   
    int x=0 , kleinst = INT_MAX , kleinstmineen = INT_MAX-1  ; 
      for ( i=0 ; i <= 10 ;i++ ) 
      { cin >> x; 
        if (x < kleinst) { kleinstmineen = kleinst; kleinst = x; }
  };      
     cout << "het een na kleinste getal is : " << kleinstmineen << endl;
     cout << "het kleinste getal is : " << kleinst  << endl;
    cin >> a;
    return 0;
     
}
