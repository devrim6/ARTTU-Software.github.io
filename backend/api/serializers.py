from rest_framework import serializers
from .models import RecruitmentApplication

# converts application objects to json and validates form input


class RecruitmentApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentApplication
        fields = ['id', 'full_name', 'email', 'faculty', 'year_of_study', 'department', 'motivation', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']

    def validate_year_of_study(self, value):
        if value < 1 or value > 6:
            raise serializers.ValidationError("year of study must be between 1 and 6")
        return value
