from django.contrib import admin

class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'currency', 'is_active']
    list_per_page = 10
    search_fields = ['name', 'category']
    list_filter = ['category', 'currency', 'is_active']

