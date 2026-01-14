from django.shortcuts import render
from django.utils import timezone

def index(request):
    years = [
        {'value': '06_menjo','label':'令和6年度'},
        {'value': '05_menjo','label':'令和5年度'},
        {'value': '04_menjo','label':'令和4年度'},
    ]
    categories_by_field = [
        {'value':'te_all','label':'テクノロジ系','categories':[
            {'id':1,'name':'基礎理論','count':169},
            {'id':2,'name':'アルゴリズムとプログラミング','count':134},
        ]},
        {'value':'ma_all','label':'マネジメント系','categories':[
            {'id':14,'name':'プロジェクトマネジメント','count':84},
        ]},
    ]
    update_histories = [
        {'date': timezone.datetime(2025,9,19), 'summary':'令和6年度分の60問を組み込みました。'},
        {'date': timezone.datetime(2024,5,19), 'summary':'令和5年度の問題を追加しました。'},
    ]
    ctx = {
        'years': years,
        'categories_by_field': categories_by_field,
        'update_histories': update_histories,
        'user_count': 367000,
        'sid': request.session.session_key or '',
    }
    return render(request, 'core/index.html', ctx)
