/*#include <iostream>
#include <string>
using namespace std;

// opg 5.2

int main()
{    const int n=10; //  n= max aantal verschillende getallen 
     int getal, c, getalteller,i, arrayteller ,a[n];
     bool b, einde; 
     
     getalteller=1; // initialiseren
     arrayteller=1; 
     i = 0;   
     einde=false;
     getal=0;         
     a[1] = getal;  
     arrayteller=0;
     for (i=1;i<n+1;i++) {a[i]=getal;}


     cout <<"Tik getallen in, gescheiden door spaties,\n"
          <<"met een regel tekst na het laatste getal:\n" 
          << " max 10 verschillende getallen:\n";

    
  while (  (cin >> getal) , ( !cin.fail() && einde==false) )
     { b=true; i=0;
         for (i=1;i<n+1;i++ )
            {if (a[i]==getal) { b=false;} ;}
         if (b==true)
            { a[arrayteller+1]=getal; 
              arrayteller++; 
              getalteller++; 
              if (getalteller > n+1) 
                 { cout << " meer dan 10 verschillende getallen" << endl; 
                   einde=true;
                 }
            }  
      }    
  cin.clear();
  cin.ignore(100, '\n');
  if ( einde != true ) cout << getalteller-1 << endl;
  system("pause");
  return 0;
     
}
*/