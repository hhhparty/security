# Getting Started with NCurses 

vi 编辑器是一个使用Curses开发的文本模式显示的编辑器。

curses 库是 BSD Unix 中内置的，Linux系统提供了类似功能的ncurses库。

Ncurses 是一个可移植的屏幕控制库，可用于生成命令行下的一些UI。

下面用一个例子来展现 curses 功能：
- 设置三个点定义一个三角形
- 随机选择一个点（x,y)
- 随机选择一个三角形的点
- 设置一个新的点作为

```c
/* triangle.c */

#include <curses.h>
#include <stdlib.h>
#include "getrandom_int.h"
#define ITERMAX 10000

int main(void)
{
    long iter;
    int yi, xi;
    int y[3], x[3];
    int index;
    int maxlines, maxcols;

    /* initialize curses */

    initscr();
    cbreak();
    noecho();

    clear();

    /* initialize triangle */

    maxlines = LINES - 1;
    maxcols = COLS - 1;

    y[0] = 0;
    x[0] = 0;

    y[1] = maxlines;
    x[1] = maxcols / 2;

    y[2] = 0;
    x[2] = maxcols;

    mvaddch(y[0], x[0], '0');
    mvaddch(y[1], x[1], '1');
    mvaddch(y[2], x[2], '2');

    /* initialize yi,xi with random values */

    yi = getrandom_int() % maxlines;
    xi = getrandom_int() % maxcols;

    mvaddch(yi, xi, '.');

    /* iterate the triangle */

    for (iter = 0; iter < ITERMAX; iter++) {
        index = getrandom_int() % 3;

        yi = (yi + y[index]) / 2;
        xi = (xi + x[index]) / 2;

        mvaddch(yi, xi, '*');
        refresh();
    }

    /* done */

    mvaddstr(maxlines, 0, "Press any key to quit");

    refresh();

    getch();
    endwin();

    exit(0);
}
```
