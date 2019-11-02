import re
from collections import namedtuple


ASCII_BYTE = r" !\"#\$%&\'\(\)\*\+,-\./0123456789:;<=>\?@ABCDEFGHIJKLMNOPQRSTUVWXYZ\[\]\^_`abcdefghijklmnopqrstuvwxyz\{\|\}\\\~\t"
ASCII_RE_4 = re.compile("([%s]{%d,})" % (ASCII_BYTE, 4))
REPEATS = ["A", "\x00", "\xfe", "\xff"]

def extract_ascii_strings(buf, n=4):
    '''
    Extract ASCII strings from the given binary data.

    :param buf: A bytestring.
    :type buf: str
    :param n: The minimum length of strings to extract.
    :type n: int
    :rtype: Sequence[String]
    '''

    if not buf:
        return

    if (buf[0] in REPEATS) and buf_filled_with(buf, buf[0]):
        return

    r = None
    if n == 4:
        r = ASCII_RE_4
    else:
        reg = "([%s]{%d,})" % (ASCII_BYTE, n)
        r = re.compile(reg)
    for match in r.finditer(buf.decode('ascii')):
        yield String(match.group().decode("ascii"), match.start())

if __name__ =="__main__":
    
    with open(".\lectures\cyberhack\demo\python.exe",'rb') as f:
        b = f.read()
    for i in b:
        if str(i).startswith('\\') or i == 0:
            continue
        else:
            print(str(i).decode('ascii'))

    exit()
    for s in extract_ascii_strings(b):
        print('0x{:x}: {:s}'.format(s.offset, s.s))

