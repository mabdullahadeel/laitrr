from django.contrib import admin
from .models import User, UserFollow, Account


class UserAdmin(admin.ModelAdmin):
    list_display = [
        "email",
        "id",
    ]
    ordering = ["-date_joined"]
    search_fields = ("id", "email")


class UserInline(admin.StackedInline):
    model = User
    can_delete = False


class AccountAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
    ]
    inlines = [
        UserInline,
    ]


admin.site.register(User, UserAdmin)
admin.site.register(UserFollow)
admin.site.register(Account, AccountAdmin)
