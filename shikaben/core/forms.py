from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(max_length=60, required=True)
    email = forms.EmailField(required=True)
    subject = forms.CharField(max_length=120, required=True)
    message = forms.CharField(widget=forms.Textarea, required=True)

    # スパム対策の簡易ハニーポット（テンプレで非表示にする）
    hp = forms.CharField(required=False, max_length=1)
