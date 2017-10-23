//opgave 11.2.c

// compileren ggc -fno-stacj-protectot 11.2.c

#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>

 
void bubble_sort(int a[], int size);
void quickSort( int[], int, int);

FILE *fp ;
int main(void) {
 
 fp = fopen ( "invoer.txt", "r" );
    
    char line[20];
    int a[8], b[8];
    int limit;
    int i;
    int j=8;
    struct timeval tv;
    int microtijd_voor,microtijd_na,microtijd_verschil;
    char *p, *q;
    
     fgets(line,200,fp);
     sscanf(line,"%d %d %d %d %d %d %d %d", 
             &a[0], &a[1], &a[2], &a[3], &a[4], &a[5], &a[6], &a[7] );       
     for(i = 0; i < 8; i++)  b[i]=a[i] ; // opslaan voor quicksort

 printf("unsorted bubble :\n");
      for(i = 0; i < 8; i++) printf("%d ", b[i]);
 printf("\n");
 
 localtime(&tv,0);
 microtijd_voor=tv.tv_usec;
  
 bubble_sort(b, 8);

 localtime(&tv,0);
 microtijd_na=tv.tv_usec;
 microtijd_verschil = microtijd_na - microtijd_voor;
 printf("sorted bubble :\n");
         for(i = 0; i < 8; i++) printf("%d ", b[i]);
 printf("\n");
 printf("verschiltijd  bubblesort  %d microsec.\n",microtijd_verschil);
 printf("\n");
 printf("unsorted quick :");
	for(i = 0; i < 8; i++) printf(" %d ", a[i]);
		
 printf("\n");
localtime(&tv,0);
 microtijd_voor=tv.tv_usec;
	quickSort( a, 0, 8);
localtime(&tv,0);
 microtijd_na=tv.tv_usec;
 microtijd_verschil = microtijd_na - microtijd_voor;

 printf("sorted  quick  : ");
	for(i = 0; i < 8; ++i) printf(" %d", a[i]);
		
 printf("\n");
 printf("verschiltijd  quicksort  %d microsec.\n",microtijd_verschil);
 printf("\n");
 //system("pause") ;
 return 0;



}

void bubble_sort(int a[], int size) {
 int switched = 1;
 int hold = 0;
 int i = 0;
 int j = 0;

 size -= 1;

 for(i = 0; i < size && switched; i++) {
  switched = 0;
  for(j = 0; j < size - i; j++)
   if(a[j] > a[j+1]) {
    switched = 1;
    hold = a[j];
    a[j] = a[j + 1];
    a[j + 1] = hold;
   }
 }
}

void quickSort( int a[], int l, int r)
{
   int j;

   if( l < r ) 
   {
   	// divide and conquer
        j = partition( a, l, r);
       quickSort( a, l, j-1);
       quickSort( a, j+1, r);
   }
	
}



int partition( int a[], int l, int r) {
   int pivot, i, j, t;
   pivot = a[l];
   i = l; j = r+1;
		
   while( 1)
   {
   	do ++i; while( a[i] <= pivot && i <= r );
   	do --j; while( a[j] > pivot );
   	if( i >= j ) break;
   	t = a[i]; a[i] = a[j]; a[j] = t;
   }
   t = a[l]; a[l] = a[j]; a[j] = t;
   return j;
}


