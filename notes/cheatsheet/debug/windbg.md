# WinDBG Cheatsheet

> Windbg的命令实在难记。

## Loading stuff

```.loadby sos mscorwks```	Load SOS extension (will identify sos location by loaded mscorwks path)
```.load``` c:\Windows\Microsoft.NET\Framework\v2.0.50727\sos	```Load SOS``` extension for  .NET 2.0
```.load psscor2```	Load PSSCOR for .NET 2.0 (replaces SOS)
```.load sosex	```Load SOSEX extension
```.load sieextpub	```Load SieExtPub extension
```.load rpcexts```	Load RPC extension
```.unload```	Unload extension
```.cordll -ve -u -l```	Retry loading of SOS
```!help <command>	```Latest extension commands help (SOS,SOSEX,PSSCOR)
```!sosex.help	```Like !help but for specifically for SOSEX
```!sosexhelp```	Display this screen or details about the specified command (SOSEX)

Load symbols if not set in environment:
```!sym noisy```
```[.symfix c:\symbols]```
```.reload```

Switched to 32bit mode after doing this: 
```.load wow64exts```
```!sw```
```.effmach```


## Examining code and stacks
```~<thread id>s```	Set active thread

```~```	all threads

```!clrstack [-a] [-p] [-l]```	managed call stack (no CLR stuff)

```!dumpstack [-ee]```	unmanaged and managed call stack

```!eestack -short [-ee]```	Run dumpstack on all threads and show only ‘interesting’ (lock, hijacked, managed)

```!mk [FrameCount] [-l] [-p] [-a]```	unmanaged and managed call stack, better than !dumpheap (sosex)

```Kb [number]	```Unmanaged stack with arguments (kb4 limits stack to 4 frames)

```!uniqstack```	Unmanaged stacks without duplication, nice if have many worker threads

```!threads [-live] [-special]	```all managed threads

```!dso [-verify] [top stack [bottom stack]]```	Objects stack trace (the actual object type and not where the method is)

```!mdso [/a | /r | /c:n | /t:<typeFilter> | /mt:<mt>]```	Dumps object references on the stack and in CPU registers in the current context

```!name2ee mscorlib.dll``` System.Threading.Thread
 
Two commands, get the .net threads object address for each thread matching by thread obj id: 
```.foreach (t {!dumpheap -mt <mtaddress> -short}) {.if(poi(${t}+28)>0){.printf ” Thread Obj: %N, Obj Address: ${t}, Name: %N \n”,poi(${t}+28), poi(${t}+c)}}```



 

## Exceptions
```!analyze -v [-hang]	-v``` Very detailed exception data (SLOW),  -hang Generates !analyze hung-application output.

```!pe [<exceptionAddr>]```	most recent exception data (don’t forget the external stack)

```!dae```	Dump all exception found (psscor)
 	 
## CLR data structures
```!eeheap -gc```	Get managed heap size

```!dumpheap [-stat] [-mt <>] [-type <>] [-strings] [-min] [-max]	```What classes take space in managed heap


```!dumpheap <address> <address>```	Show the object that are in the given memory segments (show only specific generation by combining with output of !eeheap -gc)

```!dumpgen <genNum> [-free] [-stat] [-type <>] [-nostrings]```	Dumps the contents of the specified generation (sosex)

```!gcgen <objectAddr>	```Displays the GC generation of the specified object (sosex)

```!gcroot <objectAddr> [-nostacks]```	Find how an object reference is reachable

```!refs <objectAddr> [-target|-source]```	Displays all references from and to the specified object (sosex)

```!finalizequeue```	all the object that are in finalize queue

```!finq [genNum] [-stat]```	Displays objects in the finalization queue (sosex)

```!frq [-stat]```	Display objects in the Freachable queue (sosex)
!dumpdomain	Display app-domains info

```!FindAppDomain <address>```	Determines the application domain of an object at the specified address.

```!mx <Filter String>```	Displays managed type/field/method names matching the specified filter string (sosex)

```!gchandles```	List GC handles statistics

```!gch [-handleType]```	Lists all GC Handles, optionally filtered by specified handle types

## Unmanaged Memory
```gflags /i <pocess name> +ust```	Add allocation stack for this process

```!address -summary```	Show summery of memory by types

```!heap -s```	Show all heaps

```!heap -stat -h <heap addr>```	Show blocks of specific heap

```!heap -flt s <block size>	```Show addresses of memory blocks of specific size by heap

```!heap -p -a <usrPtr>```	Display allocation call stack for given block user ptr address
 	 
 	 
## Object Inspection
```!do <address>```	information about object

```!dumpvc <mt> <address>```	Information about struct

```!mdt [typename | MT] [addr] [-r[:level]] [-e[:level]]```	Displays the fields of an object or type, -r optionally recursively, -e optionally collections (sosex)

```!mroot <addr>```	Displays GC roots for the specified object (sosex)

```!objsize <addr>```	The size of the object including all fields

```!dumpmt -md <addr>```	see what methods the object exposes (preJiv – ngen, Jit – jitted, None  – never been called)

```!name2ee * <type name>```	Get the class data for specific type

```!da <addr> [-start #] [-length #] [-details]```	Displays the contents of an array at the address 00ad28d0. starts from the second element and continues for five elements.

```!refs <addr> [-target|-source]```	Displays all references from and to the specified object (sosex)

```!DumpRCW```	.NET 4.5

## Locks
```!syncblk [-all | <syncblkNumber>]```	Show all sync blocks that are owned by the current thread but not thinlocks, use !DumpHeap -thinlock

```!DumpHeap -thinlock```	Show all the thin locks

```!dlk [-d]```	Displays deadlocks between SyncBlocks and/or ReaderWriterLocks, only managed (sosex)

```!critlist```	Get critical sections that threads are locked on (sieextpub)

```!locks	 ```

```!mlocks [-d]```	Lists all managed lock objects and CriticalSections and their owning threads (sosex)

```!mwaits [-d]```	Lists all waiting threads and, if known, the locks they are waiting on (sosex)

!rwlock [objectAddr | -nd]	Displays all RWLocks or, if provided a RWLock address, details of the specified lock (sosex)
dt <lockAddr>	 
!handle <handleAddr> f	Show data on the handle, if mutex or event can show the owner (procId.ThreadId)
Misc
.cls	Clear screen
~*e <command>	Execute command for all threads
!u, u <method intptr>	Show the disassemble of a method
!mu [addr] [-s] [-il] [-n]	Displays a disassembly around the current instruction with interleaved source, IL and asm code (sosex)
!muf [MD| Code Addr] [-s] [-il] [-n]	Displays a disassembly with interleaved source, IL and asm code (sosex)
!dumpil <method intptr>	Show the IL code of the method
!address <address>	displays information about the memory that the target process or target computer uses.
!runaway	CPU time of each thread
sxe ld:<dll name>	why a specific module was loaded
vertarget	The time of the dump
.foreach	Crazy loops
poi(<address>)	Follow reference for the given pointer (handle) address
!SaveModule <addr> <path>	Save the module dll to a file (can be used to get its version)
!TraverseHeap [-xml] <filename>	Dump heap data that can be used by CLR profiler
!teb	 displays all elements of the TEB or “Thread Environment Block”
!vmstat	 
!strings [ModuleAddress] [min] [max] [gen#] [filter]	Search the managed heap or a module for strings matching the specified criteria
!mln <addr>	Displays the type of managed data located at the specified address or the current instruction pointer
lm [v] [m] <moduleName>	Show data on the loaded modules (mscorwks, clr)
lmf	list loaded modules with full path
!filevers	Show version and paths of all loaded modules (sieextpub)
!comcalls	Show COM calls on all threads
!rpcreadstack <stack addr>	Get RPC call information (rpcexts)
!getendpointinfo <port>	searches the system’s RPC state information for endpoint information (rpcexts)