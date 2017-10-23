#include <iostream>
#include <iomanip>
#include <fstream>
#include <time.h>

using namespace std;

/*
Opdracht 11.2

1. Maak een file aan met 1000 random gehele positieve getallen van 6 posities (invoer.txt)
2. Maak  2 sorteerroutines in C++: Quicksort en Bubblesort die getallen van 6 posities kan sorteren op oplopende grootte.
3. Test deze uit met de file die onder 1 gemaakt is voor beide routines.
4. Bepaal dmv tijdroutines welke sorteermethode de snelste is.

*/

void bubbleSort(int array[])
{
    int swapped = 1;
    int length = 10000;

    for(int x = 0; (x < length) && swapped; x++)
    {
       swapped = 0;
       for(int y = x; y < length; y++)
       {
          if(array[y] < array[x])
          {
             int t = array[x];
             array[x] = array[y];
             array[y] = t;   
             swapped = 1; 
          }        
       }       
    }    
}  

int partition(int array[], int top, int bottom)
{
    int x = array[top];
    int i = top - 1;
    int j = bottom;
    int t = 0;
    
    do
    {
        do
        {
            j--;
        }while(x < array[j]);
        
        do
        {
            i++;
        }while(x > array[i]);
        
        if(i<j)
        {
            if(array[j] == -2) cout << "j: " << j << endl;
            t = array[i];
            array[i] = array[j];
            array[j] = t;
        }    
            
    }while(i < j);
    return j;    
}    

void quickSort(int array[10000], int top, int bottom)
{
    int middle;
    
    if(top < bottom)
    {
        middle = partition(array, top, bottom);
        quickSort(array, top, middle); 
        quickSort(array, middle+1, bottom);  
    }
}      

int main()
{
    // Stap 1: Genereer 1000 getallen van 6 posities
    ofstream out("invoer.txt");
    if(!out)
    {
        cout << "Kan bestand <invoer.txt> niet maken." << endl;
        system("PAUSE");
        return 1;
    }
    int n = 0;
    // Verander seed anders krijg je elke keer dezelfde volgorde van getallen
    srand(time(NULL));
    for(int i = 0; i < 10000; i++)
    {
        while((n < 100000) || (n > 999999))
        {
            // Genereer getal tussen 100000 en 999.999
            n = ((rand()|(rand()<<16)) % 999999);
        }    
        out << n << endl;
        n = 0;
    }
    out.close();  
    // Stap 2: Maak 2 Sorteerroutines
    // Stap 3: Lees 1000 getallen in, in een array
    int array[10000], count = 0;
    ifstream in("invoer.txt");
    if(!in)
    {
        cout << "Kan bestand <invoer.txt> niet openen." << endl;
        system("PAUSE");
        return 1;
    } 
    
    while(in >> n)
    {
        array[count] = n;
        count++;
    }   
    in.close(); 
    
    // Stap 4: Bepaal de snelste routine, onnauwkeurige timer gebruik.
    // Voor een nauwkeurigere timer is een platform specifieke functie nodig.
    // Deze methode is goed genoeg.
    clock_t s, e;
    s = clock();
        bubbleSort(array);
    e = clock();
    cout << "bubbleSort(): " << setw(5) << (((e - s)*1000)/CLOCKS_PER_SEC) << "ms" << endl;
    
    s = clock();
        quickSort(array, 0, 10000);
    e = clock();
    cout << "quickSort():  " << setw(5) << (((e - s)*1000)/CLOCKS_PER_SEC) << "ms" << endl;   
    
    // Stap 5: Extra stap want het is zonde om niks met de output te doen
    out.open("gesorteerd.txt");
    if(!out)
    {
        cout << "Kan bestand <gesorteerd.txt> niet maken." << endl;
        system("PAUSE");
        return 1;
    }
    for(int i = 0; i < 10000; i++)
    {
        out << array[i] << endl;   
    }
    out.close();
 
    system("PAUSE");
    return 0;   
}    
