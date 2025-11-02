from django.contrib import admin

class UserBillingAdmin(admin.ModelAdmin):
    autocomplete_fields = ['user']
    list_display = ['user_email', 'billing_name', 'billing_country', 'billing_state', 'billing_city', 'billing_address', 'billing_zipcode']
    list_select_related = ['user']
    list_per_page = 10
    search_fields = ['user__email', 'billing_name']
    list_filter = ['billing_country']

    def user_email(self, obj):
        return obj.user.email

