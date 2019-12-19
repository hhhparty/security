import numpy as np
from sklearn.tree import DecisionTreeClassifier
import matplotlib.pyplot as plt
import pandas as pd

def decisionTree(list):
    dataframe = pd.read_csv("data/vote/VoteTraining-cn.csv",header=0,sep=',')
    #data.describe()
    X = dataframe.iloc[:,:-1] #存放训练样本中无标记的数据
    X1 = pd.DataFrame() # sklearn的算法分类器大多只处理数值型矩阵，X1将存放数值化的样本
    for column in X.columns:
        X1[column] = X[column].apply(lambda x:1 if x=='y' else 2)
        
    y = dataframe.iloc[:,-1] # 存放标记    
    y1 = y.apply(lambda x:1 if x == "republican" else 2) # 对标记进行数值化
        
    # 使用决策树模型对X,y进行拟合，即生成决策树分类器
    clf = DecisionTreeClassifier(max_depth=3)
    clf.fit(X1, y1)
    # 对输入的list按上面生成的决策树分类器进行批量预测
    predict = clf.predict([list])     
    return predict[0]

def predict():
    dataframe = pd.read_csv("data/vote/Vote.csv",header=None,sep=',')    
    for index,row in dataframe.iterrows():
        #print(row.tolist()[:-1])
        row = row.apply(lambda x:1 if x=='y' else 2)
        result = decisionTree(row.tolist()[:-1])
        if result == 1:
            print("republican")
        else:
            print("democrat")
        
predict()