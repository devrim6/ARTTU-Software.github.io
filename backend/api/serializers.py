from rest_framework import serializers
from .models import Car, Sponsor, RecruitmentApplication

# ==============================================================================
# serializers
# serializers act as the bridge between django models and json
# they turn database rows into clean json objects for react
# and validate incoming json data sent from our frontend forms
# ==============================================================================

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        # expose all fields so the react car page can show full specs
        fields = '__all__'


class SponsorSerializer(serializers.ModelSerializer):
    tier_label = serializers.CharField(source='get_tier_display', read_only=True)

    class Meta:
        model = Sponsor
        # tier_label gives us the human readable tier name like "Platinum Partner"
        fields = ['id', 'name', 'tier', 'tier_label', 'website_url', 'is_active']


class RecruitmentApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentApplication
        # when a student applies from the website, status defaults to 'pending'
        fields = ['id', 'full_name', 'email', 'faculty', 'year_of_study', 'department', 'motivation', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']

    def validate_year_of_study(self, value):
        # basic validation check to ensure reasonable university year
        if value < 1 or value > 6:
            raise serializers.ValidationError("year of study must be between 1 and 6")
        return value
