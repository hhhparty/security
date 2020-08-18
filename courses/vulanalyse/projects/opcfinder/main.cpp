#include <windows.h>     
#include <stdio.h> 
#include <ctype.h>


long StrToL(char *srcStr)
{
    char* str="";
    long i = strtol(srcStr, &str, 16);//16 is Base
   
    return i;
}
int main(int argc, char* argv[])
{ 

	BYTE* ptr; 
	int position,address; 
	HINSTANCE handle; 
	BOOL done_flag = FALSE; 
    char *s="";

    if (argc < 3 )
	{
		printf("\nUsage: findopcode <some.dll> <Byte1> [Byte2 Byte3...]");
        printf("\nFor example: findopcode user32.dll 0xFF 0xE4");//0xFFE4 is the opcode of jmp esp 
		return 0;
	}
	handle = LoadLibrary(argv[1]); 
	if(!handle) 
	{ 
        
        printf("\nTry to load dll:%s raise a error !",argv[1]); 
        exit(0); 
	} 
	ptr = (BYTE*)handle; 
    s = (char *)calloc((argc-2)*4+1,sizeof(char));
    for(int i=2;i<argc;i++)
        strcat(s, argv[i]);
    printf("\nTry to find OPCODE %s in %s",s,argv[1]);
    
	for(position = 0; !done_flag; position++) 
	{ 
		try
		{
            int flag = 1;
            for(int i=2;i<argc;i++)
            {
                //printf("\n %x",StrToL(argv[i]));
                flag = flag && (ptr[position+i-2] == StrToL(argv[i]));
            }
           
            
            if(flag) 
			{ 
			    
				address = (int)ptr + position; 
				printf("\nOPCODE %s found at 0x%x",s,address); 
			} 
           
		} 
		catch(...) 
		{ 
			address = (int)ptr + position; 
			printf("END OF 0x%x\n", address); 
			done_flag = true; 
		} 
	}
	return 0;
   
}