#include <stdio.h>

double powern(double d, unsigned n)
{
    double x = 1.0;
    unsigned j;
    for(j=1;j<=n;j++)
    {
        x *= d;
    }
    return x;
}
int main(void)
{
    double sum = 0.0;
    unsigned i;
    for(i=1;i<=100000000; i++)
    {
        sum += powern(i,i%5);
    }
    printf("sum = %g\n",sum);
    return 0;
}