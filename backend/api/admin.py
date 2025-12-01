# Admin interface disabled for minimal setup
# If you want to enable admin, uncomment below and add to settings INSTALLED_APPS

# from django.contrib import admin
# from .models import FAQ, QueryLog

# @admin.register(FAQ)
# class FAQAdmin(admin.ModelAdmin):
#     list_display = ('question', 'category')
#     search_fields = ('question', 'answer', 'category')
#     list_filter = ('category',)

# @admin.register(QueryLog)
# class QueryLogAdmin(admin.ModelAdmin):
#     list_display = ('question', 'created_at')
#     search_fields = ('question', 'answer')
#     list_filter = ('created_at',)
#     readonly_fields = ('created_at',)
