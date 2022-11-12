#include<stdio.h>
#include<string.h>

void bar(int j,int k)
{
    printf("j = %d, k = %d",j,k);
}

void demo_stackframe(int a,int b,int c)
{
    int x;
    char buffer[64];
    int y;
    int z;
    x = a;
    y = b;
    z = c;
    strcpy(buffer,"abc");
    bar(z,y);
}
void main()
{
    demo_stackframe(1,2,3);
}