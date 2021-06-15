/*  null.c   */
int a(int* p);

int main(void)
{
    int* p = 0;
    return a(p);
}
int a(int* p)
{
    int y = *p;
    return y;
}

