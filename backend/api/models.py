from django.db import models

# model for student recruitment applications


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
