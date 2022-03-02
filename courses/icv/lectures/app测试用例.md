# APP 测试用例

## 代码混淆防护测试

- 工具：apktool，jeb
- 测试范围：apk文件
- 测试目标：检测apk文件是否使用混淆技术保护

### 测试过程
- 使用`apktool d testsample.apk -o outtemp`将apk文件反编译到outtemp文件夹。
- 使用浏览若干个smali文件内容，检查方法类名为原生类名，如果混淆处理过，那么类名均应为ABCD或者OOo的替代名。

```
$ less TxAppEntry.smali   

.class public Lcom/tencent/StubShell/TxAppEntry;
.super Ljava/lang/Object;
.source "TxAppEntry.java"


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 3
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method
```

上面的文件显然是没有经过混淆的。同样方法可以发现An

