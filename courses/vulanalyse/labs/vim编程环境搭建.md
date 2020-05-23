# VIM 编程环境搭建
https://www.zhihu.com/question/47691414

## vim 插件管理
熟练使用vim的人，基本上有20~50个插件。推荐使用vim-plug管理插件，而不是vundle。vim-plug插件更新也很快，不像原来每次更新都可以去喝杯茶去，最重要的是它支持插件延迟加载

```
" 定义插件，默认用法，和 Vundle 的语法差不多
Plug 'junegunn/vim-easy-align'
Plug 'skywind3000/quickmenu.vim'

" 延迟按需加载，使用到命令的时候再加载或者打开对应文件类型才加载
Plug 'scrooloose/nerdtree', { 'on':  'NERDTreeToggle' }
Plug 'tpope/vim-fireplace', { 'for': 'clojure' }

" 确定插件仓库中的分支或者 tag
Plug 'rdnetto/YCM-Generator', { 'branch': 'stable' }
Plug 'nsf/gocode', { 'tag': 'v.20150303', 'rtp': 'vim' }

```

## vim 8 C++ in linux

