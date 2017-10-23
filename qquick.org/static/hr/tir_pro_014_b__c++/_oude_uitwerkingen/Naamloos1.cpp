#include <stdio.h>
#include <string.h>
#include <stdlib.h>

main()
{
char str1[100], str2[100];
int tel = 0;
int i;
gets(str1);
int n=strlen(str1);
int w=n;
for(i=0;i<n;i++)
{
str2[w-1]=str1[i];
w--;
}
str2[strlen(str1)]='\0';
puts(str2);
system("pause");
}                                                 

