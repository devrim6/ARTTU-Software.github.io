from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Car, Sponsor, RecruitmentApplication

# management command to fill db with starter data (python manage.py seed_data)


class Command(BaseCommand):
    help = 'seed initial team data and admin user'

    def handle(self, *args, **kwargs):
        # default admin account
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@arttu.ro', 'admin123')
            self.stdout.write('created superuser admin / admin123')

        cars_data = [
            {
                'slug': 'art-04',
                'name': 'ART-04',
                'season': '2024',
                'powertrain': 'Electric AWD (4 In-Hub Motors)',
                'weight_kg': 195,
                'power_hp': 107,
                'top_speed_kmh': 120,
                'description': 'all-wheel-drive electric prototype with carbon monocoque'
            },
            {
                'slug': 'art-03',
                'name': 'ART-03',
                'season': '2022',
                'powertrain': 'Honda CBR600RR Internal Combustion',
                'weight_kg': 210,
                'power_hp': 85,
                'top_speed_kmh': 125,
                'description': 'fs balkans winner with custom aero package'
            },
            {
                'slug': 'art-02',
                'name': 'ART-02',
                'season': '2019',
                'powertrain': 'Yamaha YZF-R6 Internal Combustion',
                'weight_kg': 225,
                'power_hp': 80,
                'top_speed_kmh': 118,
                'description': 'tubular steel spaceframe with drexler diff'
            },
        ]

        for item in cars_data:
            Car.objects.get_or_create(slug=item['slug'], defaults=item)

        sponsors_data = [
            {'name': 'Technical University of Cluj-Napoca', 'tier': 'platinum', 'website_url': 'https://utcluj.ro'},
            {'name': 'Schaeffler Romania', 'tier': 'platinum', 'website_url': 'https://www.schaeffler.ro'},
            {'name': 'Continental Automotive', 'tier': 'gold', 'website_url': 'https://www.continental.com'},
            {'name': 'Bosch Engineering Center', 'tier': 'gold', 'website_url': 'https://www.bosch.ro'},
            {'name': 'MathWorks', 'tier': 'silver', 'website_url': 'https://mathworks.com'},
        ]

        for item in sponsors_data:
            Sponsor.objects.get_or_create(name=item['name'], defaults=item)

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
