from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Car, RecruitmentApplication

# basic tests for the api endpoints


class ApiEndpointsTestCase(TestCase):
    def setUp(self):
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
        response = self.client.get('/api/cars/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'ART-04')

    def test_post_recruitment_application(self):
        payload = {
            'full_name': 'Mihai Vasilescu',
            'email': 'mihai@student.utcluj.ro',
            'faculty': 'Faculty of Electrical Engineering',
            'year_of_study': 2,
            'department': 'High Voltage Powertrain',
            'motivation': 'want to work on battery management system'
        }
        response = self.client.post('/api/recruitment/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # make sure it saved in db
        self.assertEqual(RecruitmentApplication.objects.count(), 1)
        created_app = RecruitmentApplication.objects.first()
        self.assertEqual(created_app.full_name, 'Mihai Vasilescu')
        self.assertEqual(created_app.status, 'pending')
