//opgave 11.2.c

#include <iostream>
#include <cstdlib>
#include <ctime>

void bubble_sort(int a[], int size);
void quickSort( int[], int, int);

FILE *fp ;
int main(void) {
 
   fp = fopen ( "invoer.txt", "r" );
   // double tijd;
    char line[20];
    int a[8], b[8];
    int limit;
    int i;
    int j=8;
    
    char *p, *q;
   
   	clock_t start1, start2;
	clock_t end1, end2;

    fgets(line,200,fp);
    sscanf(line,"%d %d %d %d %d %d %d %d", 
    &a[0], &a[1], &a[2], &a[3], &a[4], &a[5], &a[6], &a[7] );   
           
      for(i = 0; i < 8; i++)  b[i]=a[i] ; // opslaan voor quicksort

    printf("unsorted:\n");
      for(i = 0; i < 8; i++) printf("%d ", b[i]);
    printf("\n");
    printf("\n");
    start1 = clock();
         bubble_sort(b, 8);
    end1 = clock();
  
    printf("sorted bubble :\n");
         for(i = 0; i < 8; i++) printf("%d ", b[i]);
    printf("\n");
 
    printf("verschiltijd  bubblesort  %f microsec.\n", (end1 - start1) / (double) CLOCKS_PER_SEC ) ;
    printf("\n");
    
    start1 = clock();
        quickSort( a, 0, 8);
    end1 = clock();
    printf("sorted quick :\n");
    	for(i = 0; i < 8; ++i) printf("%d ", a[i]);
    printf("\n");
    printf("verschiltijd  quicksort  %f microsec.\n", (end1 - start1) / (double) CLOCKS_PER_SEC  ) ;
    printf("\n");
    system("pause") ;
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



 
 
