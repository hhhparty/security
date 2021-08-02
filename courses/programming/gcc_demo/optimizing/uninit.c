/* A demo with errors, such as both s and x are not initialized correctly. */
int sign(int x)
{
    int s;
    if(x>0)
    {
        s = 1;
    }
    else if (x<0)
    {
        s = -1;
    }
    return s;
}