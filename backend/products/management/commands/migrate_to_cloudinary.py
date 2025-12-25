# products/management/commands/migrate_to_cloudinary.py

import os
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from products.models import ProductImage, Category, Brand
from accounts.models import User
import requests

class Command(BaseCommand):
    help = 'Migrate existing images to Cloudinary'

    def handle(self, *args, **options):
        self.stdout.write('Starting image migration to Cloudinary...\n')

        # Migrate Product Images
        self.migrate_product_images()

        # Migrate Category Images
        self.migrate_category_images()

        # Migrate Brand Logos
        self.migrate_brand_logos()

        # Migrate User Avatars
        self.migrate_user_avatars()

        self.stdout.write(self.style.SUCCESS('\n✅ Migration complete!'))

    def migrate_product_images(self):
        self.stdout.write('\n📦 Migrating Product Images...')
        images = ProductImage.objects.all()
        migrated = 0

        for img in images:
            if img.image and not str(img.image).startswith('http'):
                try:
                    # Re-save to trigger Cloudinary upload
                    # The image will be uploaded to Cloudinary when saved
                    img.save()
                    migrated += 1
                    self.stdout.write(f'  ✓ Migrated: {img.image.name}')
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'  ✗ Failed: {img.image.name} - {e}'))

        self.stdout.write(f'  Migrated {migrated} product images')

    def migrate_category_images(self):
        self.stdout.write('\n📁 Migrating Category Images...')
        categories = Category.objects.exclude(image='').exclude(image__isnull=True)
        migrated = 0

        for cat in categories:
            if cat.image and not str(cat.image).startswith('http'):
                try:
                    cat.save()
                    migrated += 1
                    self.stdout.write(f'  ✓ Migrated: {cat.name}')
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'  ✗ Failed: {cat.name} - {e}'))

        self.stdout.write(f'  Migrated {migrated} category images')

    def migrate_brand_logos(self):
        self.stdout.write('\n🏷️ Migrating Brand Logos...')
        brands = Brand.objects.exclude(logo='').exclude(logo__isnull=True)
        migrated = 0

        for brand in brands:
            if brand.logo and not str(brand.logo).startswith('http'):
                try:
                    brand.save()
                    migrated += 1
                    self.stdout.write(f'  ✓ Migrated: {brand.name}')
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'  ✗ Failed: {brand.name} - {e}'))

        self.stdout.write(f'  Migrated {migrated} brand logos')

    def migrate_user_avatars(self):
        self.stdout.write('\n👤 Migrating User Avatars...')
        users = User.objects.exclude(avatar='').exclude(avatar__isnull=True)
        migrated = 0

        for user in users:
            if user.avatar and not str(user.avatar).startswith('http'):
                try:
                    user.save()
                    migrated += 1
                    self.stdout.write(f'  ✓ Migrated: {user.username}')
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'  ✗ Failed: {user.username} - {e}'))

        self.stdout.write(f'  Migrated {migrated} user avatars')