from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms.models import BaseInlineFormSet
from . import models
from django.db.models import Case, When, IntegerField

LABELS = ["ア", "イ", "ウ", "エ"]

class ChoiceInlineFormSet(BaseInlineFormSet):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for idx, form in enumerate(self.forms):
            if "label" in form.fields and idx < 4:
                form.fields["label"].initial = LABELS[idx]
                form.fields["label"].disabled = True  # label編集を禁止（固定）

    def clean(self):
        super().clean()
        if any(self.errors):
            return

        alive = []
        correct = 0
        for form in self.forms:
            if not getattr(form, "cleaned_data", None) or form.cleaned_data.get("DELETE"):
                continue
            if not form.cleaned_data.get("text") and not form.cleaned_data.get("is_correct"):
                continue
            alive.append(form)
            if form.cleaned_data.get("is_correct"):
                correct += 1

        if len(alive) != 4:
            raise ValidationError("選択肢は4つ（ア/イ/ウ/エ）固定です。")
        if correct != 1:
            raise ValidationError("正解（is_correct）は必ず1つだけチェックしてください。")
        
    def save(self, commit=True):
        instances = super().save(commit=False)

        # 既存のlabelを把握
        existing = []
        new_forms = []
        for form in self.forms:
            if not getattr(form, "cleaned_data", None) or form.cleaned_data.get("DELETE"):
                continue
            if not form.cleaned_data.get("text") and not form.cleaned_data.get("is_correct"):
                continue

            if form.instance.pk:
                existing.append(form)
            else:
                new_forms.append(form)

        existing_labels = [f.instance.label for f in existing if f.instance.label]
        missing = [l for l in LABELS if l not in existing_labels]

        # 新規行にだけ不足ラベルを割当
        for form, label in zip(new_forms, missing):
            form.instance.label = label

        # 保存
        if commit:
            for form in existing + new_forms:
                form.instance.save()
            for obj in self.deleted_objects:
                obj.delete()

        return instances

class ChoiceInline(admin.TabularInline):
    
    model = models.Choice
    formset = ChoiceInlineFormSet
    fields = ("label", "text", "is_correct")
    can_delete = False
    max_num = 4
    min_num = 4
    validate_min = True
    validate_max = True
    
    def get_extra(self, request, obj=None, **kwargs):
        return 4 if obj is None else 0

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        order = Case(
            When(label="ア", then=0),
            When(label="イ", then=1),
            When(label="ウ", then=2),
            When(label="エ", then=3),
            default=99,
            output_field=IntegerField(),
        )
        return qs.order_by(order, "id")

admin.site.register([models.Membership, models.MembershipType, models.MembershipState])
admin.site.register(models.Category)

@admin.register(models.Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id','year','source','category','created_at')
    search_fields = ('body','source')
    list_filter = ('year','category')
    inlines = [ChoiceInline]

admin.site.register([models.PracticeSession, models.PracticeSessionDetail, models.SessionType, models.SessionState])
admin.site.register([models.LearningHistory, models.UserChecklist, models.CoverageReport, models.UpdateHistory, models.Term, models.Inquiry])

if hasattr(models, "EmailChangeToken"):
    admin.site.register(models.EmailChangeToken)
