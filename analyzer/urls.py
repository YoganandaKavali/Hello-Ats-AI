from django.urls import path

from analyzer.views import ResumeUploadView

app_name = "analyzer"

urlpatterns = [
    path("upload-resume/", ResumeUploadView.as_view(), name="upload-resume"),
]
