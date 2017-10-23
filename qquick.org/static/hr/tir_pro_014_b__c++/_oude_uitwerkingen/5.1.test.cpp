#include <stdio.h>
#include <string.h>
#include <stdlib.h>

main()
{
int i,w;
char str[100] , str2[100],*p;
printf("geef string\n");
gets(str);
p=str;
i=0;
w=strlen(str);
while ( str[i] !='\0') {i++; str2[w-1]=str[i-1];w--;}
str2[strlen(str)]='\0'; 
puts(str);
puts(str2);
//while (i!=0) { i-- ; printf("%c",*(p-1)); *p--;}
printf("\n");
system("pause");
}

