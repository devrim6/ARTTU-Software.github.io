from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Car, RecruitmentApplication

# ==============================================================================
# unit tests for backend api
# run with: python manage.py test
# checks that our api endpoints and database models behave as expected
# ==============================================================================

class ApiEndpointsTestCase(TestCase):
    def setUp(self):
        # set up test client and a sample car before each test runs
        self.client = APIClient()
        self.sample_car = Car.objects.create(
            slug='art-04',
            name='ART-04',
            season='2024',
            powertrain='Electric AWD',
            weight_kg=195,
            power_hp=107
        )

    def test_get_cars_endpoint(self):
        # test that GET /api/cars/ returns http 200 and lists our car
        response = self.client.get('/api/cars/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'ART-04')

    def test_post_recruitment_application(self):
        # test submitting an application via POST /api/recruitment/
        payload = {
            'full_name': 'Mihai Vasilescu',
            'email': 'mihai@student.utcluj.ro',
            'faculty': 'Faculty of Electrical Engineering',
            'year_of_study': 2,
            'department': 'High Voltage Powertrain',
            'motivation': 'want to help design the accumulator container and bms'
        }
        response = self.client.post('/api/recruitment/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # verify it actually exists in sqlite
        self.assertEqual(RecruitmentApplication.objects.count(), 1)
        created_app = RecruitmentApplication.objects.first()
        self.assertEqual(created_app.full_name, 'Mihai Vasilescu')
        self.assertEqual(created_app.status, 'pending')
