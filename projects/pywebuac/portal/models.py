from django.db import models
import datetime

# Create your models here.
class Task(models.Model):
    task_desc = models.CharField(max_length=300)
    task_deadline = models.DateTimeField('task deadline')

    def __str__(self):
        return "task_desc = {}，task_deadline = {}".format(self.task_desc,task_deadline)
    def was_overdue(self):
        return self.task_deadline >= timezone.now() - datetime.timedelta(days=1)
class Action(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    action_desc = models.CharField(max_length = 300)
    action_datetime = models.DateTimeField('action datetime')

    def __str__(self):
        return "action_desc = {}，action_datetime = {}".format(self.action_desc,action_datetime)
