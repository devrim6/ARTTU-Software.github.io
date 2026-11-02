from django.db import models

# ==============================================================================
# model layer (the "m" in mvc)
# this file defines the database tables using django's orm
# each class represents a table in sqlite and each variable is a column
# ==============================================================================

class Car(models.Model):
    # car table to store specs of each formula student racecar we built
    slug = models.SlugField(max_length=50, unique=True, help_text="url friendly name like art-04")
    name = models.CharField(max_length=100, help_text="official car name like ART-04")
    season = models.CharField(max_length=20, help_text="e.g. 2024 season")
    powertrain = models.CharField(max_length=100, help_text="e.g. electric awd or cbr600rr ic")
    weight_kg = models.IntegerField(null=True, blank=True, help_text="weight in kg")
    power_hp = models.IntegerField(null=True, blank=True, help_text="horsepower output")
    top_speed_kmh = models.IntegerField(null=True, blank=True, help_text="top speed in km/h")
    description = models.TextField(blank=True, help_text="short summary of the car design")

    class Meta:
        ordering = ['-season']

    def __str__(self):
        # returns friendly string representation for the django admin dashboard
        return f"{self.name} ({self.season})"


class Sponsor(models.Model):
    # sponsor table to hold our partner companies and their support level
    TIER_CHOICES = [
        ('platinum', 'Platinum Partner'),
        ('gold', 'Gold Partner'),
        ('silver', 'Silver Partner'),
        ('bronze', 'Bronze Partner'),
        ('supporter', 'Technical Supporter'),
    ]

    name = models.CharField(max_length=150)
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='supporter')
    website_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True, help_text="uncheck if sponsorship is paused")

    class Meta:
        ordering = ['tier', 'name']

    def __str__(self):
        return f"{self.name} [{self.get_tier_display()}]"


class RecruitmentApplication(models.Model):
    # recruitment table for students applying to join the formula student team
    # this gives us a working form on the frontend and a table in the backend
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('interview', 'Invited to Interview'),
        ('accepted', 'Accepted into Team'),
        ('rejected', 'Rejected'),
    ]

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    faculty = models.CharField(max_length=150, help_text="e.g. Faculty of Automation and Computer Science")
    year_of_study = models.PositiveSmallIntegerField(default=1)
    department = models.CharField(max_length=100, help_text="e.g. Software, Aerodynamics, Powertrain")
    motivation = models.TextField(help_text="why the student wants to join ART TU")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.department} ({self.status})"
