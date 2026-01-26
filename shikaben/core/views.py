from django.utils import timezone
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
import re
from django.contrib.auth import get_user_model, authenticate, login
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.validators import validate_email
from django.core.mail import send_mail
from django.core import signing
import hashlib, secrets
from django.urls import reverse
from django.db import transaction
from .models import EmailChangeToken
from django.conf import settings

def kakomon_login(request):
    # GETで /accounts/login/ に来ても、ログインページは作らない方針なので戻す
    if request.method != "POST":
        return redirect("/fekakomon.php")

    username = request.POST.get("username") or request.POST.get("userid") or ""
    password = request.POST.get("password") or ""

    user = authenticate(request, username=username, password=password)
    if user is None:
        request.session["last_login_username"] = username
        # 失敗理由を fekakomon.php へ持ち帰る（表示はテンプレ側で b() を使う）
        messages.error(request, "ユーザーIDまたはパスワードが正しくありません。")
        return redirect("/fekakomon.php?panel=login")

    login(request, user)
    return redirect("/fekakomon.php")

def fekakomon_php(request):
    context = {
        "last_login_username": request.session.pop("last_login_username", ""),
    }
    return render(request, "core/fekakomon.html", context)

USERID_RE = re.compile(r"^[0-9A-Za-z._-]{6,20}$")  # 0-9 a-z A-Z ._- で6～20

TOKEN_SALT = "email-change"
TOKEN_MAX_AGE = 60 * 60 * 24  # 24h

def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

@require_POST
def signup_api(request):
    action = request.POST.get("action")

    # 既存：regist
    if action == "regist":
        userid = (request.POST.get("userid") or "").strip()
        password = request.POST.get("password") or ""
        auto_login = request.POST.get("autoLogin") in ("1", "true", "True", "on")

        # --- ここから下はあなたの既存ロジックをそのまま ---
        if not userid or not password:
            return JsonResponse({"status": "error", "errorcode": 1, "uid": userid})
        if not USERID_RE.match(userid):
            return JsonResponse({"status": "error", "errorcode": 1, "uid": userid})
        if not (8 <= len(password) <= 32):
            return JsonResponse({"status": "error", "errorcode": 1, "uid": userid})
        if userid.lower() in password.lower():
            return JsonResponse({"status": "error", "errorcode": 2, "uid": userid})

        User = get_user_model()
        if User.objects.filter(username=userid).exists():
            return JsonResponse({"status": "error", "errorcode": 3, "uid": userid})

        try:
            validate_password(password)
        except ValidationError:
            return JsonResponse({"status": "error", "errorcode": 1, "uid": userid})

        try:
            user = User.objects.create_user(username=userid, password=password)
        except IntegrityError:
            return JsonResponse({"status": "error", "errorcode": 3, "uid": userid})
        except Exception:
            return JsonResponse({"status": "error", "errorcode": 4})

        user = authenticate(request, username=userid, password=password)
        if user:
            login(request, user)
            request.session.set_expiry(60 * 60 * 24 * 30 if auto_login else 0)

        return JsonResponse({"status": "success", "uid": userid})

    # 既存：getAccountInfo（すでに実装済みならそれでOK）
    if action == "getAccountInfo":
        if not request.user.is_authenticated:
            return JsonResponse({"status":"error","errorcode":1}, status=403)
        return JsonResponse({
            "status": "success",
            "email": request.user.email or "",
            "plan": 0,
            "backupStatus": {},
        })

    # ★追加：changeEmail
    if action == "changeEmail":
        if not request.user.is_authenticated:
            return JsonResponse({"status":"error","errorcode":1}, status=403)

        email = (request.POST.get("email") or "").strip()

        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({"status":"error","errorcode":1})

        # 既存の未使用トークンは無効化（任意：公式っぽく「最新だけ有効」）
        EmailChangeToken.objects.filter(user=request.user, used_at__isnull=True).update(
            used_at=timezone.now()
        )

        raw_token = secrets.token_urlsafe(32)
        token_hash = _hash_token(raw_token)

        EmailChangeToken.objects.create(
            user=request.user,
            new_email=email,
            token_hash=token_hash,
        )

        confirm_url = settings.SITE_URL + reverse("confirm_email") + f"?token={raw_token}"

        subject = "【基本情報技術者試験ドットコム】仮登録完了メール"
        body = f"""{request.user.get_full_name() or request.user.username} 様

メールアドレスの登録／変更を承りました。

ご本人様確認のため、下記URLへ「24時間以内」にアクセスして、
メールアドレスの本登録を完了させてください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
メールアドレス設定完了URL:
{confirm_url}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return JsonResponse({"status":"success"})

    return JsonResponse({"status":"error","errorcode":1}, status=400)


def confirm_email(request):
    """
    /confirm.php?token=... を開いたとき：
      成功 => contact_result.html?status=3
      トークン不正/再利用 => status=4
      期限切れ => status=5
    """
    raw_token = request.GET.get("token") or ""
    if not raw_token:
        return redirect(reverse("contact_result") + "?status=4")

    token_hash = _hash_token(raw_token)

    with transaction.atomic():
        row = EmailChangeToken.objects.select_for_update().filter(token_hash=token_hash).first()
        if not row:
            return redirect(reverse("contact_result") + "?status=4")

        if row.used_at is not None:
            return redirect(reverse("contact_result") + "?status=4")

        if row.is_expired():
            row.used_at = timezone.now()  # 再利用防止のため潰す
            row.save(update_fields=["used_at"])
            return redirect(reverse("contact_result") + "?status=5")

        # 成功：メール本登録＋トークン消費
        user = row.user
        user.email = row.new_email
        user.save(update_fields=["email"])

        row.used_at = timezone.now()
        row.save(update_fields=["used_at"])

    return redirect(reverse("contact_result") + "?status=3")


def contact_result(request):
    # 公式はJSでstatusを見て文言を差し替えてるので、同じやり方にするならテンプレでstatusを使う
    return render(request, "core/contact_result.html", {"status": request.GET.get("status", "")})
    # その他 action
    return JsonResponse({"status": "error", "errorcode": 1})

#以下齋藤変更内容
#メンバーシップ画面
def membership(request):
    return render(request, "core/membership.html")
#メンバーシップ登録支払画面
def membership_month(request):
    return render(request, "core/membership_month.html")  # 未作成なら後で
def membership_year(request):
    return render(request, "core/membership_year.html")  # 未作成なら後で

#Fotterの各種リンク先
def thissiteis(request):
    return render(request, "siteinfo/thissiteis.html")
def privacypolicy(request):
    return render(request, "siteinfo/privacypolicy.html")
def tokushouhou(request):
    return render(request, "siteinfo/tokushouhou.html")
def contact(request):
    return render(request, "siteinfo/contact.html")
def sitemap(request):
    return render(request, "siteinfo/sitemap.html")
def link(request):
    return render(request, "siteinfo/link.html")
def ads(request):
    return render(request, "siteinfo/ads.html")
def contact_faq(request):
    return render(request, "siteinfo/contact_faq.html")
