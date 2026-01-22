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

@require_POST
def signup_api(request):
    # JSは action=regist を投げてくる
    if request.POST.get("action") != "regist":
        return JsonResponse({"status": "error", "errorcode": 1}, status=400)

    userid = (request.POST.get("userid") or "").strip()
    password = request.POST.get("password") or ""
    auto_login = request.POST.get("autoLogin") in ("1", "true", "True", "on")

    # 形式チェック（JS側と同等の最低限）
    if not userid or not password:
        return JsonResponse({"status": "error", "errorcode": 1, "uid": userid})
    if not USERID_RE.match(userid):
        return JsonResponse({"status": "error", "errorcode": 1, "uid": userid})
    if not (8 <= len(password) <= 32):
        return JsonResponse({"status": "error", "errorcode": 1, "uid": userid})

    # JSのerrorcode=2仕様：ユーザーIDを含むパスワード禁止
    if userid.lower() in password.lower():
        return JsonResponse({"status": "error", "errorcode": 2, "uid": userid})

    User = get_user_model()

    # 既に使われている（errorcode=3）
    if User.objects.filter(username=userid).exists():
        return JsonResponse({"status": "error", "errorcode": 3, "uid": userid})

    # Djangoのパスワードバリデータが有効ならここで弾く（errorcode=1）
    try:
        validate_password(password)
    except ValidationError:
        return JsonResponse({"status": "error", "errorcode": 1, "uid": userid})

    # 作成
    try:
        user = User.objects.create_user(username=userid, password=password)
    except IntegrityError:
        return JsonResponse({"status": "error", "errorcode": 3, "uid": userid})
    except Exception:
        return JsonResponse({"status": "error", "errorcode": 4}, status=500)

    # 登録後にログイン状態にする（モーダルの「学習履歴管理」表示のため）
    user = authenticate(request, username=userid, password=password)
    if user:
        login(request, user)
        # 1ヶ月保持（JSのautoLogin）
        request.session.set_expiry(60 * 60 * 24 * 30 if auto_login else 0)

    return JsonResponse({"status": "success", "uid": userid})


