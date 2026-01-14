from django.db import models
from django.conf import settings

class User(models.Model):
    # 利用者（Django の auth.User を使わない前提の簡易モデル）
    user_id = models.CharField("ユーザーID", max_length=20, unique=True)
    password = models.CharField("パスワード", max_length=128)
    display_name = models.CharField("表示名", max_length=100, blank=True)
    email = models.EmailField("メールアドレス", blank=True, null=True)
    created_at = models.DateTimeField("登録日", auto_now_add=True)

    def __str__(self):
        return self.display_name or self.user_id

class MembershipType(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)

class MembershipState(models.Model):
    name = models.CharField(max_length=50)

class Membership(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    membership_type = models.ForeignKey(MembershipType, on_delete=models.PROTECT)
    membership_state = models.ForeignKey(MembershipState, on_delete=models.PROTECT)
    started_at = models.DateField()
    ended_at = models.DateField(null=True, blank=True)

class Category(models.Model):
    name = models.CharField(max_length=200)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)

class Question(models.Model):
    year = models.CharField(max_length=50)
    source = models.CharField(max_length=200, blank=True)
    body = models.TextField()
    explanation = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    is_calculation = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    label = models.CharField(max_length=3)
    text = models.TextField()
    is_correct = models.BooleanField(default=False)

class PracticeSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_type = models.ForeignKey('SessionType', on_delete=models.PROTECT)
    session_state = models.ForeignKey('SessionState', on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    current_index = models.IntegerField(default=0)

class PracticeSessionDetail(models.Model):
    session = models.ForeignKey(PracticeSession, related_name='details', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    order = models.IntegerField()
    answered = models.BooleanField(default=False)
    correct = models.BooleanField(null=True)

class SessionType(models.Model):
    name = models.CharField(max_length=100)

class SessionState(models.Model):
    name = models.CharField(max_length=100)

class LearningHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answered_at = models.DateTimeField(auto_now_add=True)
    answer_text = models.TextField(blank=True)
    is_correct = models.BooleanField(null=True)
    session = models.ForeignKey(PracticeSession, null=True, blank=True, on_delete=models.SET_NULL)
    exam_round = models.CharField(max_length=100, blank=True)

class UserChecklist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    color = models.CharField(max_length=20)
    updated_at = models.DateTimeField(auto_now=True)

class CoverageReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    generated_at = models.DateTimeField(auto_now_add=True)
    summary = models.TextField(blank=True)

class UpdateHistory(models.Model):
    date = models.DateField()
    title = models.CharField(max_length=200)
    body = models.TextField()

class Term(models.Model):
    term = models.CharField(max_length=200)
    description = models.TextField()

class Inquiry(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    body = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
