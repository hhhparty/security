import smtplib
from email.mime.text import MIMEText
from email.header import Header

sender = "from@163.com"
receivers = ["123@qq.com"]

message = MIMEText("Mail sending...","This is a test mail.","utf-8")
message['From'] = Header("From","utf-8")
message['To'] = Header("To",'utf-8')
subject = "Subject"
message['Subject'] = Header(subject,'utf-8')

try:
    smtp = smtplib.SMTP('192.168.43.61',25)
    smtp.sendmail(sender,receivers,message.as_string())
    print("Mail send successful.")
except smtplib.SMTPException as e:
    print("Error: ",e)