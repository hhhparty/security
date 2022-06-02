# 车辆常用checksum 方法

来源：https://reveng.sourceforge.io/crc-catalogue/all.htm#crc.cat-bits.16
## polynomial

算法中的多项式通常使用下列方式给出：

假设 The polynomial for CRC32 is:

x32 + x26 + x23 + x22 + x16 + x12 + x11 + x10 + x8 + x7 + x5 + x4 + x2 + x + 1


那么表示为二进制为：（1 0000 0100 1100 0001 0001 1101 1011 0111）B

表示为十六进制为： 0x0104C11DB7


再比如：poly=0x2f 就表示二机制：00101111，多项式为：$x^5+x^3+x^2+x+1$

此外，假设多项式为：
```
(x^3 + x^2 + x^0)(x^3 + x^1 + x^0)
= (x^6 + x^4 + x^3
 + x^5 + x^3 + x^2
 + x^3 + x^1 + x^0)
= x^6 + x^5 + x^4 + 3*x^3 + x^2 + x^1 + x^0
```

在计算机中，checksum通常是二进制计算，所以上式会变为：x^7 + x^3 + x^2 + x^1 + x^0

因为 3x^3 是 (11*^11)B，这就是：
```
=1x^110 + 1x^101 + 1x^100          + 11x^11 + 1x^10 + 1x^1 + x^0
=1x^110 + 1x^101 + 1x^100 + 1x^100 + 1x^11 + 1x^10 + 1x^1 + x^0
=1x^110 + 1x^101 + 1x^101          + 1x^11 + 1x^10 + 1x^1 + x^0
=1x^110 + 1x^110                   + 1x^11 + 1x^10 + 1x^1 + x^0
=1x^111                            + 1x^11 + 1x^10 + 1x^1 + x^0
```
https://stackoverflow.com/questions/2587766/how-is-a-crc32-checksum-calculated

## CRC-8/AUTOSAR
width=8 poly=0x2f init=0xff refin=false refout=false xorout=0xff check=0xdf residue=0x42 name="CRC-8/AUTOSAR"

Class: attested
AUTOSAR (25 November 2021), AUTOSAR Classic Platform release R21-11, Specification of CRC Routines
I Comprehensive primer on CRC theory (Section 7.1, pp.19–22)
I All parameters (Section 7.2.1.2, p.25)
IV 7 codewords (Section 7.2.1.2, p.25)
00000000​12
F20183C2
0FAA0055​C6
00FF5511​77
332255AA​BBCCDDEE​FF11
926B5533
FFFFFFFF​6C
Unique effective solution of codeword set
Created: 24 July 2016
Updated: 7 May 2022

## CRC-8/SAE-J1850
width=8 poly=0x1d init=0xff refin=false refout=false xorout=0xff check=0x4b residue=0xc4 name="CRC-8/SAE-J1850"

Class: attested
SAE Standard J1850 (15 May 1994), Excerpt (courtesy of Michael Wolf, AVRFreaks)
I Definition: Width, Poly, Init, XorOut, Residue (Section 5.4.1, p.14)
IV 7 codewords (Table 1, p.15)
00000000​59
F2018337
0FAA0055​79
00FF5511​B8
332255AA​BBCCDDEE​FFCB
926B558C
FFFFFFFF​74
AUTOSAR (25 November 2021), AUTOSAR Classic Platform release R21-11, Specification of CRC Routines
I Comprehensive primer on CRC theory (Section 7.1, pp.19–22)
I All parameters (Section 7.2.1.1, p.24)
IV 7 codewords (same as in SAE Standard J1850) (Section 7.2.1.1, p.24)
"knivmannen" (24 May 2010), StackOverflow submitted question
IV 5 codewords
55FF0000​ECFF601F
55FF0000​F0FFA038
660BEAFF​BFFFC0CA
5E18EAFF​B7FF60BD
F6301600​FCFE1081
Unique effective solution of codeword set
Created: 17 February 2016
Updated: 7 May 2022

## CRC-16/ARC
width=16 poly=0x8005 init=0x0000 refin=true refout=true xorout=0x0000 check=0xbb3d residue=0x0000 name="CRC-16/ARC"

Class: attested
Alias: ARC, CRC-16, CRC-16/LHA, CRC-IBM
AUTOSAR (25 November 2021), AUTOSAR Classic Platform release R21-11, Specification of CRC Routines
I Comprehensive primer on CRC theory (Section 7.1, pp.19–22)
I All parameters (Section 7.2.2.2, p.26)
IV 7 codewords (Section 7.2.2.2, pp.26–7)
00000000​0000
F20183E1​C2
0FAA0055​E30B
00FF5511​CF6C
332255AA​BBCCDDEE​FF98AE
926B554E​E2
FFFFFFFF​0194
System Enhancement Associates (24 October 1986), ARC 5.20
II Implementation
Haruyasu Yoshizaki (10 January 1996), LHA 2.55E
II Implementation
Rahul Dhesi (19 April 1996), ZOO 2.1a
II Implementation
Lammert Bies (August 2011), CRC calculator
II Implementation
PVL Team (25 October 2008), CRC .NET control, version 14.0.0.0
II Implementation (CRC16_arc)
Dr Ross N. Williams (19 August 1993), "A Painless Guide to CRC Error Detection Algorithms"
III All parameters (except Residue)
Emil Lenchak, Texas Instruments, Inc. (June 2018), CRC Implementation With MSP430
III All parameters (except Residue) (Section 4.6, p.6)
Altera Corporation (April 1999), crc MegaCore Function Data Sheet, version 2 (courtesy of the Internet Archive)
III All parameters (except Residue) (p.6)
Unique effective solution of codeword set
Created: 30 March 2005
Updated: 7 May 2022

## CRC-16/IBM-3740
width=16 poly=0x1021 init=0xffff refin=false refout=false xorout=0x0000 check=0x29b1 residue=0x0000 name="CRC-16/IBM-3740"

Class: attested
Alias: CRC-16/AUTOSAR, CRC-16/CCITT-FALSE
An algorithm commonly misidentified as CRC-CCITT. CRC-CCITT customarily refers to the LSB-first form of the algorithm in ITU-T Recommendation V.41 (see CRC-16/KERMIT); its MSB-first counterpart is CRC-16/XMODEM.
AUTOSAR (25 November 2021), AUTOSAR Classic Platform release R21-11, Specification of CRC Routines
I Comprehensive primer on CRC theory (Section 7.1, pp.19–22)
I All parameters (Section 7.2.2.1, pp.25–6)
IV 7 codewords (Section 7.2.2.1, p.26)
00000000​84C0
F20183D3​74
0FAA0055​2023
00FF5511​B8F9
332255AA​BBCCDDEE​FFF53F
926B5507​45
FFFFFFFF​1D0F
Western Digital Corporation (May 1980), FD 179X-02 datasheet (courtesy of Bitsavers)
I Definition: Width, Poly, Init (p.5)
Floppy disc formats: IBM 3740 (FM, e.g. Acorn DFS), ISO/IEC 8860-2:1987 (DOS 720K), ISO/IEC 9529-2:1989 (DOS 1.4M)
II Implementation
Lammert Bies (August 2011), CRC calculator
II Implementation
PVL Team (25 October 2008), CRC .NET control, version 14.0.0.0
II Implementation
Dr Ross N. Williams (19 August 1993), "A Painless Guide to CRC Error Detection Algorithms"
III All parameters (except Check, Residue)
Berndt M. Gammel (29 October 2006), Matpack 1.9.1 class MpCRC documentation
III All parameters (except Residue)
Altera Corporation (April 1999), crc MegaCore Function Data Sheet, version 2 (courtesy of the Internet Archive)
III All parameters (except Residue) (p.6)
Unique effective solution of codeword set
Created: 30 March 2005
Updated: 7 May 2022

## CRC-32/AUTOSAR
width=32 poly=0xf4acfb13 init=0xffffffff refin=true refout=true xorout=0xffffffff check=0x1697d06a residue=0x904cddbf name="CRC-32/AUTOSAR"

Class: attested
AUTOSAR (25 November 2021), AUTOSAR Classic Platform release R21-11, Specification of CRC Routines
I Comprehensive primer on CRC theory (Section 7.1, pp.19–22)
I All parameters (Section 7.2.3.2, p.28)
IV 7 codewords (Section 7.2.3.2, pp.28–9)
00000000​4022B36F
F2018325​1A724F
0FAA0055​F82D6620
00FF5511​6E99D79B
332255AA​BBCCDDEE​FF3D345A​A6
926B5578​8A68EE
FFFFFFFF​FFFFFFFF
Unique effective solution of codeword set
Created: 24 July 2016
Updated: 7 May 2022

## CRC-32/ISO-HDLC
width=32 poly=0x04c11db7 init=0xffffffff refin=true refout=true xorout=0xffffffff check=0xcbf43926 residue=0xdebb20e3 name="CRC-32/ISO-HDLC"

Class: attested
Alias: CRC-32, CRC-32/ADCCP, CRC-32/V-42, CRC-32/XZ, PKZIP
HDLC is defined in ISO/IEC 13239.
ITU-T Recommendation V.42 (March 2002)
I Definition: Residue; full mathematical description (Section 8.1.1.6.2, p.17)
AUTOSAR (25 November 2021), AUTOSAR Classic Platform release R21-11, Specification of CRC Routines
I Comprehensive primer on CRC theory (Section 7.1, pp.19–22)
I All parameters (Section 7.2.3.1, p.27)
IV 7 codewords (Section 7.2.3.1, p.27)
00000000​1CDF4421
F2018377​9DAB24
0FAA0055​87B2C9B6
00FF5511​1262A032
332255AA​BBCCDDEE​FF3D86AE​B0
926B559B​A2DE9C
FFFFFFFF​FFFFFFFF
Lasse Collin, Igor Pavlov et al. (27 August 2009), The .xz file format, version 1.0.4
I Code: C (Section 6)
IETF RFC 1662 (July 1994)
I Code: C (Appendix C.3, pp.21–3)
PKWARE Inc. (1 February 1993), PKZIP 2.04g
II Implementation
Frank J. T. Wojcik, Guy Eric Schalnat, Andreas Dilger, Glenn Randers-Pehrson et al. (15 October 1999), libpng 1.0.5
II Implementation
Lasse Collin, Igor Pavlov et al. (21 May 2011), XZ Utils 5.0.3
II Implementation
Lammert Bies (August 2011), CRC calculator
II Implementation
PVL Team (25 October 2008), CRC .NET control, version 14.0.0.0
II Implementation
Dr Ross N. Williams (19 August 1993), "A Painless Guide to CRC Error Detection Algorithms"
III All parameters (except Residue)
Emil Lenchak, Texas Instruments, Inc. (June 2018), CRC Implementation With MSP430
III All parameters (except Residue) (Section 4.6, p.6)
Berndt M. Gammel (29 October 2006), Matpack 1.9.1 class MpCRC documentation
III All parameters (except Residue)
Cisco Systems (September 2013), Meraki Air Marshal white paper
IV 1 codeword (p.9)
C0083000​28CFE952​1D3B08EA​449900E8​08EA4499​00E83001​02007E64​9416
Ryan Luecke, James Lyons (11 October 2011), CRC32 Checksums; The Good, The Bad, And The Ugly
IV 1 codeword
6173640A​CEDE2D15
Unique effective solution of codeword set
Created: 30 March 2005
Updated: 7 May 2022

## CRC-64/XZ
width=64 poly=0x42f0e1eba9ea3693 init=0xffffffffffffffff refin=true refout=true xorout=0xffffffffffffffff check=0x995dc9bbdf1939fa residue=0x49958c9abd7d353f name="CRC-64/XZ"

Class: attested
Alias: CRC-64/GO-ECMA
An algorithm commonly misidentified as ECMA. For the true ECMA algorithm see CRC-64/ECMA-182.
Go implementation reference contributed by "freetrader".
AUTOSAR (25 November 2021), AUTOSAR Classic Platform release R21-11, Specification of CRC Routines
I Comprehensive primer on CRC theory (Section 7.1, pp.19–22)
I All parameters (Section 7.2.4.1, p.29)
IV 7 codewords (Section 7.2.4.1, pp.29–30)
00000000​4B9F1B1E​3586A5F4
F20183C6​F1648166​279C31
0FAA0055​75157C66​F7D0C554
00FF5511​E604077E​BE2238A6
332255AA​BBCCDDEE​FFD5E5A8​19B2CE1E​70
926B554E​3E9FB5A9​96AA5F
FFFFFFFF​00000000​FFFFFFFF
Lasse Collin, Igor Pavlov et al. (27 August 2009), The .xz file format, version 1.0.4
I Code: C (Section 6)
Lasse Collin, Igor Pavlov et al. (21 May 2011), XZ Utils 5.0.3
II Implementation
The Go Authors, The Go Programming Language, package crc64
II Implementation (using constant crc64.ECMA)
The Go Authors (26 January 2017), The Go Programming Language, module src/hash/crc64/crc64.go
III Code: Go
The Go Authors (26 January 2017), The Go Programming Language, module src/hash/crc64/crc64_test.go
IV 32 codewords (selection)
00000000​00000000
61052B65​2E778402​33
616246B0​840E2073​65BC
61626327​76271A4A​09D82C
61626364​BA60596E​59289D3C
61626364​65F29508​FB58DF0B​04
61626364​6566F400​A745859F​8ED0
61626364​65666766​0E71CCA8​A320EC
61626364​65666768​590C7A64​0AF3B467
61626364​65666768​698EEF56​9DC8F666​99
61626364​65666768​696AF473​57CD2E3A​0932
4E657061​6C207072​656D6965​7220776F​6E277420​72657369​676E2E41​5A746AB1​F20E79
73697A65​3A202061​2E6F7574​3A202062​6164206D​61676963​4D3AD6D8​6CE4B5E3
54686520​6D616A6F​72207072​6F626C65​6D206973​20776974​68207365​6E646D61​696C2E20​202D4D61​726B2048​6F72746F​6E51A0F2​946BAF5A​86
54686973​20697320​61207465​7374206F​66207468​6520656D​65726765​6E637920​62726F61​64636173​74207379​7374656D​2E72BC5B​C17F18DB​27
Unique effective solution of codeword set
Created: 4 July 2011
Updated: 7 May 2022