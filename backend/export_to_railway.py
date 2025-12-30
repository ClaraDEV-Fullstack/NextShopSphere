# export_to_railway.py
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nextshopsphere.settings')

import django
django.setup()

from django.core import serializers
from products.models import Category, Product, ProductImage

def export_data():
    print("\n📦 Exporting data...\n")

    export_dir = os.path.join(os.path.dirname(__file__), 'exports')
    os.makedirs(export_dir, exist_ok=True)

    # Categories
    cats = Category.objects.all()
    with open(os.path.join(export_dir, 'categories.json'), 'w') as f:
        f.write(serializers.serialize('json', cats, indent=2))
    print(f"  ✅ {cats.count()} categories")

    # Products
    prods = Product.objects.all()
    with open(os.path.join(export_dir, 'products.json'), 'w') as f:
        f.write(serializers.serialize('json', prods, indent=2))
    print(f"  ✅ {prods.count()} products")

    # Images
    imgs = ProductImage.objects.all()
    with open(os.path.join(export_dir, 'product_images.json'), 'w') as f:
        f.write(serializers.serialize('json', imgs, indent=2))
    print(f"  ✅ {imgs.count()} images")

    print(f"\n📁 Saved to: {export_dir}")

if __name__ == '__main__':
    export_data()