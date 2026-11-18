from django.contrib import admin
from .models import RecruitmentApplication

# register recruitment model in django admin


@admin.register(RecruitmentApplication)
class RecruitmentApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'department', 'faculty', 'year_of_study', 'status', 'created_at')
    list_filter = ('status', 'department', 'year_of_study')
    search_fields = ('full_name', 'email', 'motivation')
    list_editable = ('status',)
    readonly_fields = ('created_at',)
