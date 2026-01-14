from django.contrib import admin
from .models import (
    User, Membership, MembershipType, MembershipState,
    Category, Question, Choice,
    PracticeSession, PracticeSessionDetail, SessionType, SessionState,
    LearningHistory, UserChecklist, CoverageReport,
    UpdateHistory, Term, Inquiry
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'display_name', 'email', 'created_at')
    search_fields = ('user_id','display_name','email')

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
