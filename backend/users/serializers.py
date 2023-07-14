from typing import Type
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserFollow, User as CustomUser, Account

User: Type[CustomUser] = get_user_model()


class PublicAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = "__all__"


class UserPublicSerializer(serializers.ModelSerializer):
    account = PublicAccountSerializer()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "account",
        ]
        read_only_fields = ["account"]


class FollowUserSerializer(serializers.Serializer):
    follower_id = serializers.CharField(max_length=36)

    class Meta:
        fields = [
            "follower_id",
        ]

    def validate_follower_id(self, value):
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError(detail={"message": "User does not exist"})
        return value

    def create(self, validated_data):
        user: CustomUser = self.context["request"].user
        try:
            UserFollow.objects.get_or_create(
                user_id=validated_data["follower_id"], follower_id=user.id
            )
            return validated_data
        except Exception as e:
            raise serializers.ValidationError(detail={"message": str(e)})

    def delete(self, validated_data):
        user: CustomUser = self.context["request"].user
        try:
            r = UserFollow.objects.filter(
                user_id=validated_data["follower_id"], follower_id=user.id
            )
            print(validated_data)
            print(r)
            UserFollow.objects.filter(
                user_id=validated_data["follower_id"],
                follower_id=user.id,
            ).delete()
            return validated_data
        except Exception as e:
            raise serializers.ValidationError(detail={"message": str(e)})
