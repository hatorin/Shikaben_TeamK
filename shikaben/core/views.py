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
    action = request.POST.get("action")

    # 1) 登録（今まで通り）
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

    # 2) アカウント情報取得（←これが今必要）
    if action == "getAccountInfo":
        if not request.user.is_authenticated:
            # ※HTTP 400にしない（done側でerrorcode処理させるため）
            return JsonResponse({"status": "error", "errorcode": 1})

        # 公式JSが期待してるキーを返す
        email = request.user.email or ""  # 未登録なら空文字でOK
        plan = 0  # ひとまず未登録扱い（0:未登録）
        # backupStatus を返すと「取得状況」ボタンが活きるので、未実装なら返さないのが安全
        return JsonResponse({
            "status": "success",
            "email": email,
            "plan": plan,
            # "backupStatus": {},  # 実装したら入れる
        })

    # 3) setRank（これも公式JSが叩きがちなので、最低限スタブ）
    if action == "setRank":
        if not request.user.is_authenticated:
            return JsonResponse({"status": "error", "errorcode": 1})
        rank = request.POST.get("rank")
        return JsonResponse({"status": "success", "rank": rank})

    # その他 action
    return JsonResponse({"status": "error", "errorcode": 1})
