# import_to_railway.py
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nextshopsphere.settings')

import django
django.setup()

from django.core import serializers
from django.db import transaction
from products.models import Category, Product, ProductImage

def import_data():
    print("\n📥 Importing to Railway...\n")

    export_dir = os.path.join(os.path.dirname(__file__), 'exports')

    if not os.path.exists(export_dir):
        print("❌ No exports folder! Run export_to_railway.py first.")
        return

    try:
        with transaction.atomic():
            # Categories
            with open(os.path.join(export_dir, 'categories.json'), 'r') as f:
                for obj in serializers.deserialize('json', f.read()):
                    obj.save()
            print("  ✅ Categories")

            # Products
            with open(os.path.join(export_dir, 'products.json'), 'r') as f:
                for obj in serializers.deserialize('json', f.read()):
                    obj.save()
            print("  ✅ Products")

            # Images
            with open(os.path.join(export_dir, 'product_images.json'), 'r') as f:
                for obj in serializers.deserialize('json', f.read()):
                    obj.save()
            print("  ✅ Images")

        print("\n🎉 Done!")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == '__main__':
    import_data()