#include <iostream>  
using namespace std; 

void setint(int*, int); 
int main() 
{ 
   int a; 
   setint(&a, 10); 
   cout << a << endl; 
   
   int* b; 
   setint(b, 10); 
   cout << *b << endl; 
   
   return 0; 
} 

void setint(int* ip, int i)
{
   *ip = i; 
}