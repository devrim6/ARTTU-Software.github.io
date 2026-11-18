from rest_framework import serializers
from .models import Car, Sponsor, RecruitmentApplication

# turns model objects into json and validates incoming form data


class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'


class SponsorSerializer(serializers.ModelSerializer):
    tier_label = serializers.CharField(source='get_tier_display', read_only=True)

    class Meta:
        model = Sponsor
        fields = ['id', 'name', 'tier', 'tier_label', 'website_url', 'is_active']


class RecruitmentApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentApplication
        fields = ['id', 'full_name', 'email', 'faculty', 'year_of_study', 'department', 'motivation', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']

    def validate_year_of_study(self, value):
        # check that year makes sense for university
        if value < 1 or value > 6:
            raise serializers.ValidationError("year of study must be between 1 and 6")
        return value
