from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import RecruitmentApplication

# basic crud tests for recruitment api


class RecruitmentApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_post_and_get_application(self):
        payload = {
            'full_name': 'Mihai Vasilescu',
            'email': 'mihai@student.utcluj.ro',
            'faculty': 'Faculty of Electrical Engineering',
            'year_of_study': 2,
            'department': 'High Voltage Powertrain',
            'motivation': 'want to work on battery management system'
        }
        res = self.client.post('/api/recruitment/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(RecruitmentApplication.objects.count(), 1)

        list_res = self.client.get('/api/recruitment/')
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_res.data), 1)
        self.assertEqual(list_res.data[0]['full_name'], 'Mihai Vasilescu')
