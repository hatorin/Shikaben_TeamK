from django.utils import timezone
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
import re
from django.contrib.auth import get_user_model, authenticate, login, logout
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
from django.contrib.auth import update_session_auth_hash
import string
from django.core.cache import cache
from django.db.utils import OperationalError
from django.db.models.deletion import ProtectedError
from django.views.decorators.http import require_http_methods

def kakomon_login(request):
    # GETで /accounts/login/ に来ても、ログインページは作らない方針なので戻す
    if request.method != "POST":
        return redirect("/fekakomon.html")

    username = request.POST.get("username") or request.POST.get("userid") or ""
    password = request.POST.get("password") or ""

    user = authenticate(request, username=username, password=password)
    if user is None:
        request.session["last_login_username"] = username
        # 失敗理由を fekakomon.html へ持ち帰る（表示はテンプレ側で b() を使う）
        messages.error(request, "ユーザーIDまたはパスワードが正しくありません。")
        return redirect("/fekakomon.html?panel=login")

    login(request, user)
    return redirect("/fekakomon.html")

def fekakomon(request):
    context = {
        "last_login_username": request.session.pop("last_login_username", ""),
    }
    return render(request, "core/fekakomon.html", context)

USERID_RE = re.compile(r"^[0-9A-Za-z._-]{6,20}$")  # 0-9 a-z A-Z ._- で6～20
PASS_RE = re.compile(r"^[0-9A-Za-z`~!@#$%^&*_\+\-=\{\}\[\]\|:;\"'<>\.,\?/]{8,32}$")

TOKEN_SALT = "email-change"
TOKEN_MAX_AGE = 60 * 60 * 24  # 24h

def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def _make_temp_password(userid: str, length: int = 12) -> str:
    # JSの案内に合わせて「半角英数字・記号」で作る（8〜32）
    # 記号は安全寄りに厳選（メールで崩れやすいクォート系は避ける）
    symbols = "`~!@#$%^&*_+-={}[]|:;<>.,?/"
    alphabet = string.ascii_letters + string.digits + symbols

    for _ in range(10):
        pw = "".join(secrets.choice(alphabet) for _ in range(length))
        # 公式仕様っぽく「ユーザーIDを含むパスワード禁止」
        if userid.lower() not in pw.lower():
            return pw
    # まれに当たるので最後の保険
    return "".join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))

# 重要操作の「直前確認」有効期限
SENSITIVE_OK_SECONDS = 5 * 60  # 5分

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

    # ★追加：changePassword
    if action == "changePassword":
        # セッション/ログイン必須（JSの errorcode=6 相当）
        if not request.user.is_authenticated:
            return JsonResponse({"status": "error", "errorcode": 6}, status=403)

        current = request.POST.get("password") or ""
        new = request.POST.get("password_new") or ""
        confirm = request.POST.get("password_confirm") or ""

        # 必須チェック（JSの errorcode=1 相当）
        if not current or not new or not confirm:
            return JsonResponse({"status": "error", "errorcode": 1})

        # 形式チェック（8〜32、許可文字のみ）
        if not PASS_RE.match(new) or not PASS_RE.match(confirm):
            return JsonResponse({"status": "error", "errorcode": 1})

        userid = request.user.username  # 送られてきたuseridは信用しない

        # ユーザーIDを含むパスワード禁止（errorcode=2）
        if userid.lower() in new.lower():
            return JsonResponse({"status": "error", "errorcode": 2})

        # 現在パスワードと同じは禁止（errorcode=3）
        if current == new:
            return JsonResponse({"status": "error", "errorcode": 3})

        # confirm 不一致（errorcode=4）
        if new != confirm:
            return JsonResponse({"status": "error", "errorcode": 4})

        # 現在パスワードが正しいか（errorcode=5）
        if not request.user.check_password(current):
            return JsonResponse({"status": "error", "errorcode": 5})

        # 更新（失敗したら errorcode=7）
        try:
            request.user.set_password(new)
            request.user.save()

            # これが超重要：変更後もログイン状態を維持する
            update_session_auth_hash(request, request.user)

        except Exception:
            return JsonResponse({"status": "error", "errorcode": 7}, status=500)

        return JsonResponse({"status": "success"})

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

        subject = "【シカベン】仮登録完了メール"
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
    
    # ★追加：resetPassword
    if action == "resetPassword":
        userid = (request.POST.get("userid") or "").strip()
        email = (request.POST.get("email") or "").strip()

        # 必須 & 形式
        if not userid or not email:
            return JsonResponse({"status": "error", "errorcode": 1})
        if not USERID_RE.match(userid):
            return JsonResponse({"status": "error", "errorcode": 1})
        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({"status": "error", "errorcode": 1})

        # 簡易ロックアウト（10分で5回以上失敗したら）
        ip = request.META.get("REMOTE_ADDR", "")
        lock_key = f"pwreset:{userid}:{ip}"
        tries = cache.get(lock_key, 0)
        if tries >= 5:
            return JsonResponse({"status": "error", "errorcode": 3})

        User = get_user_model()

        try:
            user = User.objects.get(username=userid)
        except User.DoesNotExist:
            cache.set(lock_key, tries + 1, 60 * 10)
            return JsonResponse({"status": "error", "errorcode": 1})
        except OperationalError:
            return JsonResponse({"status": "error", "errorcode": 6})

        # email一致（登録済みと同じか）
        if (user.email or "").lower() != email.lower():
            cache.set(lock_key, tries + 1, 60 * 10)
            return JsonResponse({"status": "error", "errorcode": 2})

        # 仮パスワード発行 → 送信失敗時に戻せるよう元のhashを保持
        old_hash = user.password
        temp_pw = _make_temp_password(userid, length=12)

        try:
            user.set_password(temp_pw)
            user.save(update_fields=["password"])
        except Exception:
            return JsonResponse({"status": "error", "errorcode": 4})

        login_url = request.build_absolute_uri("/fekakomon.html")
        subject = "【シカベン】仮パスワードの発行"
        body = f"""{user.get_full_name() or user.username} 様

パスワードリセットを承りました。

以下の仮パスワードを発行いたしましたので、
これを使用してアカウントにログイン後、パスワードの変更を行ってください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
仮パスワード:
{temp_pw}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

        try:
            send_mail(
                subject=subject,
                message=body,
                from_email=None,          # DEFAULT_FROM_EMAIL を使う
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception:
            # メール送信に失敗したらパスワードも元に戻す（重要）
            user.password = old_hash
            user.save(update_fields=["password"])
            return JsonResponse({"status": "error", "errorcode": 5})

        # 成功したらロックアウト回数リセット（任意）
        cache.delete(lock_key)

        return JsonResponse({"status": "success"})
    
    # ★追加：load (重要操作の直前確認用nonce発行)
    if action == "load":
        # 公式の挙動に寄せるなら「ログイン必須」でOK
        if not request.user.is_authenticated:
            # errorcodeはフロントの想定に寄せる（例: 4=ユーザーID/セッション不正）
            return JsonResponse({"status": "error", "errorcode": 4}, status=403)

        # ワンタイムnonceを発行してセッションへ
        nonce = secrets.token_urlsafe(16)
        request.session["sensitive_nonce"] = nonce
        request.session["sensitive_nonce_at"] = timezone.now().timestamp()

        # どんな場合も JSON を返す（parsererror回避）
        return JsonResponse({"status": "success", "nonce": nonce})
    
    # ★追加：continue (重要操作の直前確認パスワードチェック)
    if action == "continue":
        if not request.user.is_authenticated:
            return JsonResponse({"status": "error", "errorcode": 4}, status=403)

        # T() が nonce を送ってくる場合に備えて受ける（無くても動くようにしておく）
        nonce_req = (request.POST.get("nonce") or "").strip()
        nonce_sess = request.session.get("sensitive_nonce")

        # nonceが送られてきた時だけ厳密チェック（送られない実装でも落ちない）
        if nonce_req:
            if (not nonce_sess) or (nonce_req != nonce_sess):
                return JsonResponse({"status": "error", "errorcode": 4}, status=400)

        password = request.POST.get("password") or request.POST.get("pass") or ""
        if not password:
            return JsonResponse({"status": "error", "errorcode": 1}, status=400)

        # パスワード確認（Django auth）
        user = authenticate(request, username=request.user.username, password=password)
        if user is None:
            # フロントの想定: 1/2 が「ID or パスワード不正」系で使われがち
            return JsonResponse({"status": "error", "errorcode": 1}, status=200)

        # 「確認済み」状態をセッションに保存
        request.session["sensitive_ok_at"] = timezone.now().timestamp()
        return JsonResponse({"status": "success"})
    
    # ★追加：deleteAccount
    if action == "deleteAccount":
        if not request.user.is_authenticated:
            return JsonResponse({"status": "error", "errorcode": 4}, status=403)

        # 直前確認が済んでいるか（T()を通したか）をチェック
        ok_at = request.session.get("sensitive_ok_at")
        if not ok_at:
            return JsonResponse({"status": "error", "errorcode": 4}, status=200)

        if timezone.now().timestamp() - float(ok_at) > SENSITIVE_OK_SECONDS:
            return JsonResponse({"status": "error", "errorcode": 4}, status=200)

        # 念のためdeleteAccountでもパスワードを最終確認（公式もだいたい二重）
        password = request.POST.get("password") or ""
        user = authenticate(request, username=request.user.username, password=password)
        if user is None:
            return JsonResponse({"status": "error", "errorcode": 1}, status=200)

        # 削除（関連FKは on_delete に従って消える/残る）
        try:
            user_obj = request.user
            logout(request)               # セッション破棄
            user_obj.delete()             # ユーザー削除
        except Exception:
            return JsonResponse({"status": "error", "errorcode": 3}, status=200)

        return JsonResponse({"status": "success"})

    return JsonResponse({"status":"error","errorcode":1}, status=400)


def confirm_email(request):
    """
    /confirm_email.html?token=... を開いたとき：
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

#メンバーシップ画面
@require_http_methods(["GET", "POST"])
def membership(request):
    # 画面表示（従来どおり）
    if request.method == "GET":
        return render(request, "core/membership.html")

    # ここから API（T() が叩く）
    action = request.POST.get("action")

    # action不正（JS側で 12/13 を出してるので寄せる）
    if action != "cancel_membership":
        return JsonResponse({"status": "error", "errorcode": 12})

    # ログイン切れ
    if not request.user.is_authenticated:
        # T() は errorcode=11 を「ログイン切れ」として扱っている
        return JsonResponse({"status": "error", "errorcode": 11}, status=403)

    password = request.POST.get("password") or ""
    if not password:
        # ここはJSに該当メッセージが無いので、2(パスワード不正)寄せでも可
        return JsonResponse({"status": "error", "errorcode": 2})

    # パスワード確認（現在ログイン中ユーザーで検証）
    user = authenticate(request, username=request.user.username, password=password)
    if user is None:
        return JsonResponse({"status": "error", "errorcode": 2})

    # ここで「メンバーシップ解約処理」を行う
    # まだ決済連携/DBが無いなら、まずは「成功で返す」だけでOK（deleteAccountを先に完成させる）
    # TODO: membershipモデル/決済連携が入ったらここを本実装
    try:
        # 例：セッションやユーザー属性の plan を落とす等（あなたの実装方針に合わせる）
        # request.user.plan = 0; request.user.save(update_fields=["plan"])
        pass
    except Exception:
        return JsonResponse({"status": "error", "errorcode": 7})
    
    request.session["sensitive_ok_at"] = timezone.now().timestamp()

    return JsonResponse({"status": "success"})

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
