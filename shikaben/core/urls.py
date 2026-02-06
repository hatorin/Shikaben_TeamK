from django.urls import path
from . import views
from django.shortcuts import redirect

def root(request):
    return redirect("/fekakomon.html")

urlpatterns = [
    path("", root, name="root"),
    path("fekakomon.html", views.fekakomon, name="fekakomon"),
    path("fekakomon_question.html", views.fekakomon_question, name="fekakomon_question"),
    # AJAX用
    path("api/doujou/answer/", views.api_doujou_answer, name="api_doujou_answer"),
    path("api/doujou/next/", views.api_doujou_next, name="api_doujou_next"),
    path("api/doujou/reveal/", views.api_doujou_reveal, name="api_doujou_reveal"),
    path("doujou/complete/", views.doujou_complete, name="doujou_complete"),
    path("membership/", views.membership, name="membership"),
    path("membership/month/", views.membership_month, name="membership_month"),
    path("membership/year/", views.membership_year, name="membership_year"),
    path("membership/complete/", views.membership_complete, name="membership_complete"),
    path("thissiteis.html", views.thissiteis, name="thissiteis_html"),
    path("privacypolicy.html", views.privacypolicy, name="privacypolicy_html"),
    path("tokushouhou.html", views.tokushouhou, name="tokushouhou_html"),
    path("contact.html", views.contact, name="contact_html"),
    path("sitemap.html", views.sitemap, name="sitemap_html"),
    path("link.html", views.link, name="link_html"),
    path("ads.html", views.ads, name="ads_html"),
    path("contact_faq.html", views.contact_faq, name="contact_faq_html"),
]
