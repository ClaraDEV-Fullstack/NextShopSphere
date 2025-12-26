# products/management/commands/upload_images_to_cloudinary.py
from django.core.management.base import BaseCommand
from products.models import ProductImage
import cloudinary.uploader

class Command(BaseCommand):
    help = "Upload all local product images to Cloudinary (including manually updated ones)."

    def handle(self, *args, **options):
        self.stdout.write("🚀 Starting upload of all product images to Cloudinary...\n")

        all_images = ProductImage.objects.all()
        uploaded_count = 0

        for img_obj in all_images:
            # Check if the image is already a Cloudinary URL
            if img_obj.image.url.startswith("http") and "res.cloudinary.com" in img_obj.image.url:
                self.stdout.write(f"  ⚡ Already on Cloudinary, skipping: {img_obj.product.name}")
                continue

            # Upload local image to Cloudinary
            try:
                upload_result = cloudinary.uploader.upload(img_obj.image.path)
                img_obj.image = upload_result["secure_url"]
                img_obj.save()
                uploaded_count += 1
                self.stdout.write(f"  ✓ Uploaded: {img_obj.product.name}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Failed: {img_obj.product.name} | {str(e)}"))

        self.stdout.write(self.style.SUCCESS(
            f"\n✅ Finished uploading images. Total uploaded: {uploaded_count}/{all_images.count()}"
        ))
