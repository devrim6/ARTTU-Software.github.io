from django.db import models

# database models (the M in mvc)


class Car(models.Model):
    slug = models.SlugField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    season = models.CharField(max_length=20)
    powertrain = models.CharField(max_length=100)
    weight_kg = models.IntegerField(null=True, blank=True)
    power_hp = models.IntegerField(null=True, blank=True)
    top_speed_kmh = models.IntegerField(null=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['-season']

    def __str__(self):
        return f"{self.name} ({self.season})"


class Sponsor(models.Model):
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
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['tier', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_tier_display()})"


class RecruitmentApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('interview', 'Invited to Interview'),
        ('accepted', 'Accepted into Team'),
        ('rejected', 'Rejected'),
    ]

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    faculty = models.CharField(max_length=150)
    year_of_study = models.PositiveSmallIntegerField(default=1)
    department = models.CharField(max_length=100)
    motivation = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.department} ({self.status})"
