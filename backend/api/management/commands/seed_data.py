from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Car, Sponsor, RecruitmentApplication

# ==============================================================================
# database seeder command
# run with: python manage.py seed_data
# this fills the sqlite database with starter data from our formula student team
# and creates an admin user so we don't have to start with an empty database
# ==============================================================================

class Command(BaseCommand):
    help = 'seeds initial team data and admin account for course demonstration'

    def handle(self, *args, **kwargs):
        # 1. create admin user for the course demo
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@arttu.ro', 'admin123')
            self.stdout.write(self.style.SUCCESS('created superuser "admin" with password "admin123"'))
        else:
            self.stdout.write('admin user already exists')

        # 2. seed formula student cars
        cars_data = [
            {
                'slug': 'art-04',
                'name': 'ART-04',
                'season': '2024',
                'powertrain': 'Electric AWD (4 In-Hub Motors)',
                'weight_kg': 195,
                'power_hp': 107,
                'top_speed_kmh': 120,
                'description': 'our first all-wheel-drive electric prototype featuring carbon monocoque and custom torque vectoring'
            },
            {
                'slug': 'art-03',
                'name': 'ART-03',
                'season': '2022',
                'powertrain': 'Honda CBR600RR Internal Combustion',
                'weight_kg': 210,
                'power_hp': 85,
                'top_speed_kmh': 125,
                'description': 'championship winner at fs balkans with custom aero package and dry-sump lubrication'
            },
            {
                'slug': 'art-02',
                'name': 'ART-02',
                'season': '2019',
                'powertrain': 'Yamaha YZF-R6 Internal Combustion',
                'weight_kg': 225,
                'power_hp': 80,
                'top_speed_kmh': 118,
                'description': 'tubular steel spaceframe with drexler limited slip differential'
            },
        ]

        for item in cars_data:
            car, created = Car.objects.get_or_create(slug=item['slug'], defaults=item)
            if created:
                self.stdout.write(f"added car: {car.name}")

        # 3. seed sample sponsors
        sponsors_data = [
            {'name': 'Technical University of Cluj-Napoca', 'tier': 'platinum', 'website_url': 'https://utcluj.ro'},
            {'name': 'Schaeffler Romania', 'tier': 'platinum', 'website_url': 'https://www.schaeffler.ro'},
            {'name': 'Continental Automotive', 'tier': 'gold', 'website_url': 'https://www.continental.com'},
            {'name': 'Bosch Engineering Center', 'tier': 'gold', 'website_url': 'https://www.bosch.ro'},
            {'name': 'MathWorks', 'tier': 'silver', 'website_url': 'https://mathworks.com'},
        ]

        for item in sponsors_data:
            sponsor, created = Sponsor.objects.get_or_create(name=item['name'], defaults=item)
            if created:
                self.stdout.write(f"added sponsor: {sponsor.name}")

        # 4. seed sample recruitment application
        if RecruitmentApplication.objects.count() == 0:
            RecruitmentApplication.objects.create(
                full_name='Andrei Popescu',
                email='andrei.popescu@student.utcluj.ro',
                faculty='Faculty of Automation and Computer Science',
                year_of_study=2,
                department='Software & Telemetry',
                motivation='passionate about embedded telemetry and can bus protocols, want to write data logging firmware for art-04',
                status='pending'
            )
            self.stdout.write('added sample recruitment application for testing')

        self.stdout.write(self.style.SUCCESS('successfully finished seeding database!'))
