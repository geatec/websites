#include <iostream>
#include <string>
#include <fstream>
#include <cstdlib>
#include <vector>
#include <iomanip>
#include <time.h>
#include <sstream>

//#include "opdrachten.h"

using namespace std;

/*

#OPDRACHT 11.2

1. Maak een file aan met 1000 random gehele positieve getallen van 6 posities ( invoer.txt)
2. Maak  2 sorteerroutines in C++:  Quicksort  en Bubblesort die getallen van 6 posities  kan 
    sorteren op oplopende grootte.
3. Test deze uit met de file die onder 1 gemaakt is voor beide routines.
4. Bepaal dmv tijdroutines welke sorteermethode de snelste is.


*/

//declaraties
int lengthFinal = 1000;
int numbers[10000];
char ch;

void generateFile();
int generateRandomNr();
vector<string> readFile();
void BubbleSort();
void QuickSortMain();
void quicksort(int numbers[], int lengte);

int generateRandomNr()
{
    int nr = 0;
    int randomMult;
    int lowest=10000, highest=100000;
    int range=(highest-lowest)+1; 

    nr = rand() % highest + lowest;
    
    randomMult = rand() % 9 + 1; //verder randomiseren
    
    nr *= randomMult;
    
    if(nr > highest) nr /= 10; //zorgen dat getal niet groter dan 6 digits wordt

    return nr;
}

void generateFile()
{
    int nr;
    ofstream fileout("c:/elftweeRandomNrs.txt");
    if(!fileout)
    {
        cout << "Outputfile error!" << endl;
    }
    
    for(int i = 0; i < lengthFinal; i++)
    {
        nr = generateRandomNr();
        fileout << nr;
        if (i < lengthFinal-1) fileout << endl;
    }    
 
    fileout.close();
}    

void QuickSortMain()
{
  int length = lengthFinal, i, j, elapTicks;
  double elapMilli, elapSeconds, elapMinutes;
 
  clock_t Begin, End; //initialize Begin and End for the timer

  Begin = clock() * CLK_TCK; //start the timer 
    
  //sort
 
  quicksort(numbers, length);
  
  //end sort
    
 End = clock() * CLK_TCK;        //stop the timer
         
     
 elapTicks = End - Begin;        //the number of ticks from Begin to End
 elapMilli = elapTicks/1000;     //milliseconds from Begin to End
 elapSeconds = elapMilli/1000;   //seconds from Begin to End
 elapMinutes = elapSeconds/60;   //minutes from Begin to End
     
 if(elapSeconds < 1)
 cout<<"QuickSort: took "<<elapMilli<<" milliseconds." << endl;
 else if(elapSeconds == 1)
  cout<<"QuickSort: took 1 second." << endl;
 else if(elapSeconds > 1 && elapSeconds < 60)
  cout<<"QuickSort: took  "<<elapSeconds<<" seconds." << endl;
 else if(elapSeconds >= 60)     
  cout<<"QuickSort took  "<<elapMinutes<<" minutes." << endl;  
cin >> ch;
 
    }

void quicksort(int numbers[], int lengte){
    
    int i;
    int resultaat[lengte];
    int kleiner = 0;
    int groter = lengte - 1;
 
    if (lengte > 1)
    {
      //als er geen of 1 element is, dan moet er niet gesorteerd worden
      //neem als pivot het eerste element
      for (i = 1; i < lengte; i++)
      {
        //ga al de andere elementen af
        if (numbers[i] < numbers[0])
        {
          //kleiner dan pivot, plaats vooraan in resultaat
          resultaat[kleiner] = numbers[i];
          kleiner++;
        }
        else
        {
          //groter dan pivot, plaats achteraan in resultaat
          resultaat[groter] = numbers[i];
          groter--;
        }
      }
      resultaat[kleiner] = numbers[0];
      //zet het pivot juist
      for (i = 0; i < lengte; i++)
      {
        //kopieer resultaat naar data
        numbers[i] = resultaat[i];
      }
      if (lengte > 2)
      {
        //als er minder dan 3 elementen zijn, dan zijn ze daar juist gesorteerd
        quicksort(numbers, kleiner);
        //sorteer groep voor pivot
        quicksort(numbers + kleiner + 1, lengte - kleiner - 1);
        //sorteer groep na pivot
      }
    }
}

void BubbleSort()
{
  
  int length = lengthFinal, i, j, elapTicks;
  int temp;
  double elapMilli, elapSeconds, elapMinutes;
 
  clock_t Begin, End; //initialize Begin and End for the timer

  Begin = clock() * CLK_TCK; //start the timer 
    
  //sort
  for (i = (length - 1); i > 0; i--)
  {
    for (j = 1; j <= i; j++)
    {
      if (numbers[j-1] > numbers[j])
      {
        temp = numbers[j-1];
        numbers[j-1] = numbers[j];
        numbers[j] = temp;
      }
    }
  }
    
 End = clock() * CLK_TCK;        //stop the timer
         
     
 elapTicks = End - Begin;        //the number of ticks from Begin to End
 elapMilli = elapTicks/1000;     //milliseconds from Begin to End
 elapSeconds = elapMilli/1000;   //seconds from Begin to End
 elapMinutes = elapSeconds/60;   //minutes from Begin to End
    
 if(elapSeconds < 1)
 cout<<"BubbleSort: took "<<elapMilli<<" milliseconds." << endl;
 else if(elapSeconds == 1)
  cout<<"BubbleSort: took 1 second." << endl;
 else if(elapSeconds > 1 && elapSeconds < 60)
  cout<<"BubbleSort: took  "<<elapSeconds<<" seconds." << endl;
 else if(elapSeconds >= 60)     
  cout<<"BubbleSort took  "<<elapMinutes<<" minutes." << endl;  

}

vector<string> readFile()
{
   
  vector<string> text_file;

  ifstream filein( "elftweeRandomNrs.txt" );
  string temp;

  while( getline( filein, temp ) )
     text_file.push_back( temp );
     
  return text_file;
}

int main()
{
     
    vector<string> text_file;
    string tempStr;
    
    //file aanmaken met random nummers
    generateFile();
    
    
    //getallen in vector plaatsen
    text_file = readFile();
    
    //vector naar array schrijven
    for(int i =0; i < text_file.size(); i++)
    {
        tempStr = text_file[i];
        istringstream buffer( tempStr );
        buffer >> numbers[i];
    }    

   //bubblesort
    BubbleSort();

    //array resetten
    for(int i =0; i < text_file.size(); i++)
    {
        tempStr = text_file[i];
        istringstream buffer( tempStr );
        buffer >> numbers[i];
    }    
    //quicksort   
    QuickSortMain();
    

}
