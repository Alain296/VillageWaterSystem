# Quick fix - run these commands in Django shell

from api.models import User

# Fix admin password
admin = User.objects.get(username='admin')
admin.set_password('admin123')
admin.save()
print('Admin password fixed!')

# Fix manager password
manager = User.objects.get(username='manager1')
manager.set_password('manager123')
manager.save()
print('Manager password fixed!')

print('Done! You can now login.')
