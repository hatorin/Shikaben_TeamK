from django.urls import path
from . import views
from django.shortcuts import redirect

def root(request):
    return redirect("/fekakomon.html")

urlpatterns = [
    path("", root, name="root"),
    path("fekakomon.html", views.fekakomon, name="fekakomon"),
    path("fekakomon_q.php", views.fekakomon_question, name="fekakomon_question"),
    path("membership/", views.membership, name="membership"),
    path("membership/month/", views.membership_month, name="membership_month"),
    path("membership/year/", views.membership_year, name="membership_year"),
    path("thissiteis.html", views.thissiteis, name="thissiteis_html"),
    path("privacypolicy.html", views.privacypolicy, name="privacypolicy_html"),
    path("tokushouhou.html", views.tokushouhou, name="tokushouhou_html"),
    path("contact.html", views.contact, name="contact_html"),
    path("sitemap.html", views.sitemap, name="sitemap_html"),
    path("link.html", views.link, name="link_html"),
    path("ads.html", views.ads, name="ads_html"),
    path("contact_faq.html", views.contact_faq, name="contact_faq_html"),
]
