from django.contrib import admin
from .models import (
    Membership, MembershipType, MembershipState,
    Category, Question, Choice,
    PracticeSession, PracticeSessionDetail, SessionType, SessionState,
    LearningHistory, UserChecklist, CoverageReport,
    UpdateHistory, Term, Inquiry,
    EmailChangeToken,  # もしあるなら
)

admin.site.register([Membership, MembershipType, MembershipState])
admin.site.register(Category)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id','year','source','category','created_at')
    search_fields = ('body','source')
    list_filter = ('year','category')

admin.site.register(Choice)
admin.site.register([PracticeSession, PracticeSessionDetail, SessionType, SessionState])
admin.site.register([LearningHistory, UserChecklist, CoverageReport, UpdateHistory, Term, Inquiry])
admin.site.register(EmailChangeToken)  # もしあるなら
