#include <stdio.h>

void demo_xdecl(int w,int x,int y,int z)
{
    int a,b,c=1,d;
    a = x;
    b = y;
    c = z;
    d = w;
    printf("w=%d,x=%d,y=%d,z=%d",d,a,b,c);
}

int main()
{
    demo_xdecl(50,1,2,3);
}