# Windows Powershell Tutorial

## What is it?

Windows PowerShell is a Windows command-line shell designed especially for system administrators. Windows PowerShell includes an interactive prompt and a scripting environment that can be used independently or in combination.

Unlike most shells, which accept and return text, Windows PowerShell is built on top of the .NET Framework common language runtime (CLR) and the .NET Framework, and accepts and returns .NET Framework objects. This fundamental change in the environment brings entirely new tools and methods to the management and configuration of Windows.

Windows PowerShell introduces the concept of a cmdlet (pronounced "command-let"), a simple, single-function command-line tool built into the shell. You can use each cmdlet separately, but their power is realized when you use these simple tools in combination to perform complex tasks. Windows PowerShell includes more than one hundred basic core cmdlets, and you can write your own cmdlets and share them with other users.

Like many shells, Windows PowerShell gives you access to the file system on the computer. In addition, Windows PowerShell providers enable you to access other data stores, such as the registry and the digital signature certificate stores, as easily as you access the file system.

This Getting Started guide provides an introduction to Windows PowerShell: the language, the cmdlets, the providers, and the use of objects.

## Why use it?

Here, are some important reason for using Powershell:

- Powershell offers a well-integrated command-line experience for the operation system
- PowerShell allows complete access to all of the types in the .NET framework
- Trusted by system administrators.
- PowerShell is a simple way to manipulate server and workstation components
- It's geared toward system administrators by creating a more easy syntax
- PowerShell is more secure than running VBScript or other scripting languages

## Cmdlet

A cmdlet which is also called Command let is a is a lightweight command used in the Window base PowerShell environment. PowerShell invokes these cmdlets in the command prompt. You can create and invoke cmdlets command using PowerShell APIS.

- Cmdlets are different from commands in other command-shell environments in the following manners 
- Cmdlets are .NET Framework class objects It can't be executed separately
- Cmdlets can construct from as few as a dozen lines of code
- Parsing, output formatting, and error presentation are not handled by cmdlets
- Cmdlets process works on objects. So text stream and objects can't be passed as output for pipelining
- Cmdlets are record-based as so it processes a single object at a time

**Most of the PowerShell functionality comes from Cmdlet's which is always in verb-noun format and not plural. Moreover, Cmdlet's return objects not text. A cmdlet is a series of commands, which is more than one line, stored in a text file with a .psl extension.**

A cmdlet always consists of a verb and a noun, separated with a hyphen. Some of the verbs use for you to learn PowerShell is:

- Get — To get something
- Start — To run something
- Out — To output something
- Stop — To stop something that is running
- Set — To define something
- New — To create something

### A list of important PowerShell Commands:

#### 1 Get-Help

Help about PowerShell commands and topics.
```
# Example: Display help information about the command Format-Table

Get-Help Format-Table
```
#### 2 Get-Command

Get information about anything that can be invoked.
```
# Example: To generate a list of cmdlets, functions installed in your machine

Get-Command
```

#### 3 Get-Service

Finds all cmdlets with the word 'service' in it.
```
# Example: Get all services that begin with "vm"

Get-Service "vm*"
```

#### 4 Get- Member

Show what can be done with an object
```
# Example: Get members of the vm processes.

Get-Service "vm*" | Get-Member

```

#### Get-Module 

Shows packages of commands

#### Get-Content 

This cmdlet can take a file and process its contents and do something with it
```
Example: Create a Folder

New-Item -Path 'X:\Guru99' -ItemType Directory
```

## Data types

- Boolean
- Byte
  - 8 bits
- Char
  - 16 bit unsigned number from 0 to 65535
- Date
- Decimal
  - 128 bit decimal value
- Double
  - 64 bit floating point number
- Integer
  - 32 bit signed whole number
- Long
  - 64 bit signed whole number
- Object
- Short
  - 16 bit unsigned number
- Single
  - single-precision 32bit floating point number
- String
  - text

## Special Variables

| Special Variable| Description| 
|-|-|
| $Error| An array of error objects which display the most recent errors| 
| $Host| Display the name of the current hosting application| 
| $Profile| Stores entire path of a user profile for the default shell| 
| $PID| Stores the process identifier| 
| $PSUICulture| It holds the name of the current UI culture.| 
| $NULL| Contains empty or NULL value.| 
| $False| Contains FALSE value| 
| $True| Contains TRUE value| 

## PowerShell Scripts

Powershell scripts are store in .ps1 file. By default, you can't run a script by just double-clicking a file. This protects your system from accidental harm. 

### To execute a script:

#### Step 1: right-click it and click "Run with PowerShell."

Moreover, there is a policy which restricts script execution. You can see this policy by running the Get-ExecutionPolicy command.

You will get one of the following output:

- Restricted— No scripts are allowed. This is the default setting, so it will display first time when you run the command.
- AllSigned— You can run scripts signed by a trusted developer. With the help of this setting, a script will ask for confirmation that you want to run it before executing.
- RemoteSigned— You can run your or scripts signed by a trusted developer.
- Unrestricted— You can run any script which you wants to run

##### Steps to Change Execution Policy

Step 1) Open an elevated PowerShell prompt. Right Click on PowerShell and "Run as Administrator"

Step 2) Enter the Following commands

Get-ExecutionPolicy
Set-execution policy unrestricted
Enter Y in the prompt
Get-ExecutionPolicy

## todo
https://www.guru99.com/powershell-tutorial.html

https://www.tutorialspoint.com/powershell/powershell_overview.htm

https://docs.microsoft.com/en-us/powershell/scripting/getting-started/getting-started-with-windows-powershell?view=powershell-6