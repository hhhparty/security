# ChatGLM-6B

ChatGLM-6B 在 2023/03/19 更新增加了量化后的 INT4 模型，官方直接针对性的量化模型后提供下载。对比原版自己设置量化效果好一些，而且模型大小只有 4G，极大地加快了下载速度。 对于只有 CPU 或者只有 6G 显存的同学，可以直接选择量化后的模型下载和部署，本文单独更新了 ChatGLM-6B-int4 版本的部署教程，在第四章，需要部署的可以直接跳转到第四章，忽略前面的内容。huggingface 地址：https://huggingface.co/THUDM/chatglm-6b-int4


## 下载
下载分为下列部分

1.下载chatglm源文件
到 GitHub 中下载其他环境配置文件和 demo 程序代码。GitHub 地址：https://github.com/THUDM/ChatGLM-6B。下载到 …/ChatGLM/ 这个目录下即可。


2.下载glm模型文件
模型文件需要在 huggingface 上进行下载：https://huggingface.co/THUDM/chatglm-6b
点击【Files and versions】即可下载文件。建议下载到一个新建文件夹中，如大文件夹是 ChatGLM，把模型文件放到 model 文件夹里，整体结构就是 … /ChatGLM/model。
如果模型文件（大于 1G 的）下载速度慢，可以在国内源中单独下载这几个模型文件（其他这个源没有的文件还是需要在 huggingface 上下载）：https://cloud.tsinghua.edu.cn/d/fb9f16d6dc8f482596c2/
下载完成之后确保下图这些文件都在模型文件夹下（例如存放在 … /ChatGLM/model 下）

```
wlgfb@wlgfbdl:~/Downloads$ python3
Python 3.10.6 (main, Mar 10 2023, 10:55:28) [GCC 11.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> from huggingface_hub import snapshot_download
>>> snapshot_download(repo_id="THUDM/chatglm-6b-int4")
```
下载成功后，可以在  ~/.cache/huggingface/hub/models--THUDM--chatglm-6b-int4/snapshots/e02ba894cf18f3fd9b2526c795f983683c4ec732/ 下发现内容。

## 部署

把模型部署在本地，需要在 Python 环境下安装影响的库，此外还需要针对 GPU 安装相应版本的 cuda 和对应的 Pytorch。之后修改 demo 文件就可以启动运行了。

1.配置环境

安装自己 GPU 对应的 cuda，这个网上教程很多，不再赘述。（如果只有 cpu，则跳过该步骤）
根据上一步安装的 cuda 版本，下载安装对应版本的 pytorch，网上也有很多教程。（如果只有 cpu，也需要安装 cpu 版的 pytorch）
上述两步完成后，在 …/ChatGLM/ 目录下打开命令行终端，输入
pip install -r requirements.txt 
按回车后，pip 就自动下载和安装相关依赖库了。

上述三个步骤完成后，部署的环境就搭建完成了。下面仅需要稍微修改 demo 的代码，或者自己根据 demo 编写程序，就可以开始使用 ChatGLM-6B 了！

还可以查看一下是否支持cuda
wlgfb@wlgfbdl:~/workspace/ChatGLM-6B/models$ python3
Python 3.10.6 (main, Mar 10 2023, 10:55:28) [GCC 11.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import torch
>>> print(torch.cuda.is_available())
True


2.修改 demo 程序中的model路径

在 …/ChatGLM/ 目录下有两个 demo 代码：（1）cli_demo.py，直接在命令行中输入进行问答；（2）web_demo.py，利用 gradio 库生成问答网页。

第一个 demo 方便，还可以清除历史记录，但是在命令行（尤其是 Linux 命令行）中容易输入一些奇怪的字符，这会使得程序意外停止；第二个 demo 界面简单，但是不能清除记录，而且如果在没有图形界面的 Linux 系统服务器中使用，需要端口映射到本地电脑，再打开浏览器访问。个人建议，如果有能力，可以自己综合二者的有点自己编写，比如使用 jupyter 就可以很好结合二者，还可以以 markdown 渲染输出，使得代码或者公式更好看。

修改模型路径。编辑 cli_demo.py 代码，修改 5、6 行的模型文件夹路径，将原始的 “THUDM/ChatGLM-6B” 替换为 “model” 即可。
```
vim cli_demo.py
tokenizer = AutoTokenizer.from_pretrained("models", trust_remote_code=True)
model = AutoModel.from_pretrained("models", trust_remote_code=True).half().cuda()

```
修改量化版本。如果你的显存大于 14G，则无需量化可以跳过此步骤。如果你的显存只有 6G 或 10G，则需要在第 6 行代码上添加 quantize(4) 或 quantize(8) ，如下：

model = AutoModel.from_pretrained("THUDM/chatglm-6b", trust_remote_code=True).quantize(8).half().cuda()


## 训练自己的数据集

ChatGLM-6B/ptuning下有：
- train.sh
- evaluate.sh 

这里面的train_file 、validation_file 为自己的json数据集路径，并将prompt_column 和 response_column 改为json文件中输入文本和输出文本对应的key。

将自己的数据集换成以下格式
{
“content”: “类型#上衣版型#宽松版型#显瘦图案#线条衣样式#衬衫衣袖型#泡泡袖衣款式#抽绳”,
“summary”: “这件衬衫的款式非常的宽松，利落的线条可以很好的隐藏身材上的小缺点，穿在身上有着很好的显瘦效果。领口装饰了一个可爱的抽绳，漂亮的绳结展现出了十足的个性，配合时尚的泡泡袖型，尽显女性甜美可爱的气息。”
}

开始训练

train.sh 中的 PRE_SEQ_LEN 和 LR 分别是 soft prompt 长度和训练的学习率，可以进行调节以取得最佳的效果。P-Tuning-v2 方法会冻结全部的模型参数，可通过调整 quantization_bit 来被原始模型的量化等级，不加此选项则为 FP16 精度加载。

在默认配置 quantization_bit=4、per_device_train_batch_size=1、gradient_accumulation_steps=16 下，INT4 的模型参数被冻结，一次训练迭代会以 1 的批处理大小进行 16 次累加的前后向传播，等效为 16 的总批处理大小，此时最低只需 6.7G 显存。若想在同等批处理大小下提升训练效率，可在二者乘积不变的情况下，加大 per_device_train_batch_size 的值，但也会带来更多的显存消耗，请根据实际情况酌情调整。

验证模型

将 evaluate.sh 中的 CHECKPOINT 更改为训练时保存的 checkpoint 名称，运行以下指令进行模型推理和评测：
bash evaluate.sh


模型部署

3.1 自己验证 ,更换模型路径
将对应的demo或代码中的THUDM/chatglm-6b换成经过 P-Tuning 微调之后 checkpoint 的地址（在示例中为 ./output/adgen-chatglm-6b-pt-8-1e-2/checkpoint-3000）。注意，目前的微调还不支持多轮数据，所以只有对话第一轮的回复是经过微调的。

备注:预训练模型地址一般存放位置在本机

.cache/huggingface/hub/models–THUDM–chatglm-6b/snapshots/aa51e62ddc9c9f334858b0af44cf59b05c70148a/
查看包含这些目录
config.json configuration_chatglm.py modeling_chatglm.py pytorch_model.bin quantization.py
替换掉 demo.py 文件中THUDM/chatglm-6b为自己路径
