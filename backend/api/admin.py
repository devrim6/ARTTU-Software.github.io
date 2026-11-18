from django.contrib import admin
from .models import Car, Sponsor, RecruitmentApplication

# register models in django admin so we get crud pages out of the box


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('name', 'season', 'powertrain', 'weight_kg', 'power_hp')
    list_filter = ('season', 'powertrain')
    search_fields = ('name', 'season', 'description')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Sponsor)
class SponsorAdmin(admin.ModelAdmin):
    list_display = ('name', 'tier', 'is_active', 'website_url')
    list_filter = ('tier', 'is_active')
    search_fields = ('name',)


@admin.register(RecruitmentApplication)
class RecruitmentApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'department', 'faculty', 'year_of_study', 'status', 'created_at')
    list_filter = ('status', 'department', 'year_of_study')
    search_fields = ('full_name', 'email', 'motivation')
    # let us change status right from the list view
    list_editable = ('status',)
    readonly_fields = ('created_at',)
