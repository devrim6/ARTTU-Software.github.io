from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import RecruitmentApplication

# seeds default admin user and one sample application (python manage.py seed_data)


class Command(BaseCommand):
    help = 'seed admin user and starter application'

    def handle(self, *args, **kwargs):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@arttu.ro', 'admin123')
            self.stdout.write('created superuser admin / admin123')

        if RecruitmentApplication.objects.count() == 0:
            RecruitmentApplication.objects.create(
                full_name='Andrei Popescu',
                email='andrei.popescu@student.utcluj.ro',
                faculty='Faculty of Automation and Computer Science',
                year_of_study=2,
                department='Software & Telemetry',
                motivation='interested in embedded telemetry and can bus logging',
                status='pending'
            )

        self.stdout.write('done seeding db')
