 #include <iostream>

using namespace std;

int main()
{ 
 int n=0, i, a[10], x;
 cout << "Typ een rij gehele getallen in; sluit af met een letter of stop woord:" << endl;
 while (cin >> x)
 { 
  for (i=0; i<n; i++)
   if (x == a[i]) break;
   if (i == n){
   // d.w.z. geen gelijkheid aangetroffen dus x is nieuw
    if (n == 10){ // al 10 getallen geplaatst in array a
    cout << "Meer dan 10 verschillende getallen.\n";
    system("pause");
    return 0;
   }
   a[n++] = x;
  }
   }
   cout << "Aantal verschillende gelezen getallen: " << n << endl;
   system("PAUSE");
   return 0;
}

