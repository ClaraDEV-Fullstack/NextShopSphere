from django.core.management.base import BaseCommand
from django.db import transaction
from products.models import Category, Brand, ShippingOption


class Command(BaseCommand):
    help = 'Seeds the database with initial categories, brands, and shipping options'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            self.clear_data()

        self.stdout.write('Seeding categories...')
        self.seed_categories()
        self.stdout.write('Seeding brands...')
        self.seed_brands()
        self.stdout.write('Seeding shipping options...')
        self.seed_shipping_options()
        self.stdout.write(self.style.SUCCESS('✅ Database seeded successfully!'))

    def clear_data(self):
        """Clear existing categories, brands, and shipping options"""
        Category.objects.all().delete()
        Brand.objects.all().delete()
        ShippingOption.objects.all().delete()
        self.stdout.write(self.style.WARNING('  Cleared all categories, brands, and shipping options'))

    @transaction.atomic
    def seed_categories(self):
        """Create main categories and subcategories"""

        categories_data = [
            {
                'name': 'Electronics',
                'slug': 'electronics',
                'description': 'Phones, laptops, accessories, gaming, and gadgets',
                'icon': 'laptop',
                'display_order': 1,
                'featured': True,
                'subcategories': [
                    {'name': 'Smartphones', 'slug': 'smartphones'},
                    {'name': 'Laptops & Computers', 'slug': 'laptops-computers'},
                    {'name': 'Tablets', 'slug': 'tablets'},
                    {'name': 'Headphones & Audio', 'slug': 'headphones-audio'},
                    {'name': 'Smart Watches', 'slug': 'smart-watches'},
                    {'name': 'Cameras', 'slug': 'cameras'},
                    {'name': 'Gaming', 'slug': 'gaming'},
                    {'name': 'Electronics Accessories', 'slug': 'electronics-accessories'},
                ]
            },
            {
                'name': 'Fashion',
                'slug': 'fashion',
                'description': 'Men, women, shoes, bags, clothes, and accessories',
                'icon': 'shirt',
                'display_order': 2,
                'featured': True,
                'subcategories': [
                    {'name': "Men's Clothing", 'slug': 'mens-clothing'},
                    {'name': "Women's Clothing", 'slug': 'womens-clothing'},
                    {'name': 'Footwear', 'slug': 'footwear'},
                    {'name': 'Bags & Luggage', 'slug': 'bags-luggage'},
                    {'name': 'Watches', 'slug': 'fashion-watches'},
                    {'name': 'Jewelry', 'slug': 'jewelry'},
                    {'name': 'Sunglasses', 'slug': 'sunglasses'},
                    {'name': 'Fashion Accessories', 'slug': 'fashion-accessories'},
                ]
            },
            {
                'name': 'Home & Living',
                'slug': 'home-living',
                'description': 'Furniture, lamps, kitchen tools, and organizing supplies',
                'icon': 'home',
                'display_order': 3,
                'featured': True,
                'subcategories': [
                    {'name': 'Furniture', 'slug': 'furniture'},
                    {'name': 'Lighting', 'slug': 'lighting'},
                    {'name': 'Kitchen & Dining', 'slug': 'kitchen-dining'},
                    {'name': 'Bedding', 'slug': 'bedding'},
                    {'name': 'Home Decor', 'slug': 'home-decor'},
                    {'name': 'Storage & Organization', 'slug': 'storage-organization'},
                    {'name': 'Bathroom', 'slug': 'bathroom'},
                ]
            },
            {
                'name': 'Beauty & Skincare',
                'slug': 'beauty-skincare',
                'description': 'Makeup, skincare, hair care, and perfumes',
                'icon': 'sparkles',
                'display_order': 4,
                'featured': True,
                'subcategories': [
                    {'name': 'Skincare', 'slug': 'skincare'},
                    {'name': 'Makeup', 'slug': 'makeup'},
                    {'name': 'Hair Care', 'slug': 'hair-care'},
                    {'name': 'Fragrances', 'slug': 'fragrances'},
                    {'name': 'Bath & Body', 'slug': 'bath-body'},
                    {'name': 'Nail Care', 'slug': 'nail-care'},
                    {'name': "Men's Grooming", 'slug': 'mens-grooming'},
                ]
            },
            {
                'name': 'Books & Education',
                'slug': 'books-education',
                'description': 'Novels, textbooks, and self-help books',
                'icon': 'book-open',
                'display_order': 5,
                'featured': True,
                'subcategories': [
                    {'name': 'Fiction', 'slug': 'fiction'},
                    {'name': 'Non-Fiction', 'slug': 'non-fiction'},
                    {'name': 'Self-Help', 'slug': 'self-help'},
                    {'name': 'Business & Finance', 'slug': 'business-finance'},
                    {'name': 'Technology Books', 'slug': 'technology-books'},
                    {'name': "Children's Books", 'slug': 'childrens-books'},
                    {'name': 'Textbooks', 'slug': 'textbooks'},
                ]
            },
            {
                'name': 'Sports & Fitness',
                'slug': 'sports-fitness',
                'description': 'Gym equipment, sportswear, and fitness accessories',
                'icon': 'fire',
                'display_order': 6,
                'featured': True,
                'subcategories': [
                    {'name': 'Exercise Equipment', 'slug': 'exercise-equipment'},
                    {'name': 'Sportswear', 'slug': 'sportswear'},
                    {'name': 'Yoga & Pilates', 'slug': 'yoga-pilates'},
                    {'name': 'Outdoor Sports', 'slug': 'outdoor-sports'},
                    {'name': 'Fitness Accessories', 'slug': 'fitness-accessories'},
                    {'name': 'Supplements', 'slug': 'supplements'},
                    {'name': 'Smart Fitness', 'slug': 'smart-fitness'},
                ]
            },
            {
                'name': 'Kids & Toys',
                'slug': 'kids-toys',
                'description': 'Toys, games, and kids accessories',
                'icon': 'puzzle',
                'display_order': 7,
                'featured': True,
                'subcategories': [
                    {'name': 'Action Figures', 'slug': 'action-figures'},
                    {'name': 'Dolls & Playsets', 'slug': 'dolls-playsets'},
                    {'name': 'Building Blocks', 'slug': 'building-blocks'},
                    {'name': 'Educational Toys', 'slug': 'educational-toys'},
                    {'name': 'Outdoor Play', 'slug': 'outdoor-play'},
                    {'name': 'Board Games', 'slug': 'board-games'},
                    {'name': 'Baby Toys', 'slug': 'baby-toys'},
                ]
            },
            {
                'name': 'Digital Products',
                'slug': 'digital-products',
                'description': 'Ebooks, templates, icons, and software',
                'icon': 'cloud-download',
                'display_order': 8,
                'featured': True,
                'subcategories': [
                    {'name': 'Ebooks', 'slug': 'ebooks'},
                    {'name': 'Templates', 'slug': 'templates'},
                    {'name': 'Graphics & Icons', 'slug': 'graphics-icons'},
                    {'name': 'Software', 'slug': 'software'},
                    {'name': 'Online Courses', 'slug': 'online-courses'},
                    {'name': 'Music & Audio', 'slug': 'music-audio'},
                    {'name': 'Fonts', 'slug': 'fonts'},
                ]
            },
        ]

        for cat_data in categories_data:
            subcategories = cat_data.pop('subcategories', [])

            # Create or update main category
            main_cat, created = Category.objects.update_or_create(
                slug=cat_data['slug'],
                defaults={
                    'name': cat_data['name'],
                    'description': cat_data.get('description', ''),
                    'icon': cat_data.get('icon', 'tag'),
                    'display_order': cat_data.get('display_order', 0),
                    'featured': cat_data.get('featured', False),
                    'parent': None,
                }
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(f"  {action}: {main_cat.name}")

            # Create subcategories
            for sub_data in subcategories:
                sub_cat, created = Category.objects.update_or_create(
                    slug=sub_data['slug'],
                    defaults={
                        'name': sub_data['name'],
                        'parent': main_cat,
                        'icon': cat_data.get('icon', 'tag'),
                        'description': sub_data.get('description', ''),
                    }
                )
                action = 'Created' if created else 'Updated'
                self.stdout.write(f"    {action}: {sub_cat.name}")

    @transaction.atomic
    def seed_brands(self):
        """Create sample brands"""

        brands_data = [
            # Electronics
            {'name': 'Apple', 'slug': 'apple', 'description': 'Think Different', 'is_featured': True},
            {'name': 'Samsung', 'slug': 'samsung', 'description': "Do What You Can't", 'is_featured': True},
            {'name': 'Sony', 'slug': 'sony', 'description': 'Be Moved', 'is_featured': True},
            {'name': 'LG', 'slug': 'lg', 'description': "Life's Good", 'is_featured': False},
            {'name': 'Lenovo', 'slug': 'lenovo', 'description': 'Different is Better', 'is_featured': False},
            {'name': 'Dell', 'slug': 'dell', 'description': 'The Power To Do More', 'is_featured': False},
            {'name': 'HP', 'slug': 'hp', 'description': 'Keep Reinventing', 'is_featured': False},
            {'name': 'Bose', 'slug': 'bose', 'description': 'Better Sound Through Research', 'is_featured': True},
            # Fashion
            {'name': 'Nike', 'slug': 'nike', 'description': 'Just Do It', 'is_featured': True},
            {'name': 'Adidas', 'slug': 'adidas', 'description': 'Impossible Is Nothing', 'is_featured': True},
            {'name': 'Zara', 'slug': 'zara', 'description': 'Love your curves', 'is_featured': True},
            {'name': 'H&M', 'slug': 'hm', 'description': 'Fashion and quality at the best price', 'is_featured': False},
            {'name': 'Gucci', 'slug': 'gucci', 'description': 'Quality is remembered long after price is forgotten', 'is_featured': True},
            {'name': 'Louis Vuitton', 'slug': 'louis-vuitton', 'description': 'The art of travel', 'is_featured': True},
            # Beauty
            {'name': 'Dior', 'slug': 'dior', 'description': 'Perfection in every detail', 'is_featured': True},
            {'name': 'Fenty Beauty', 'slug': 'fenty-beauty', 'description': 'Beauty for all', 'is_featured': True},
            {'name': 'CeraVe', 'slug': 'cerave', 'description': 'Developed with dermatologists', 'is_featured': False},
            {'name': "L'Oreal", 'slug': 'loreal', 'description': "Because you're worth it", 'is_featured': True},
            # Sports
            {'name': 'Puma', 'slug': 'puma', 'description': 'Forever Faster', 'is_featured': False},
            {'name': 'Under Armour', 'slug': 'under-armour', 'description': 'I Will', 'is_featured': False},
            {'name': 'Fitbit', 'slug': 'fitbit', 'description': 'Find your fit', 'is_featured': False},
            # Home
            {'name': 'IKEA', 'slug': 'ikea', 'description': 'The wonderful everyday', 'is_featured': True},
            {'name': 'Philips', 'slug': 'philips', 'description': 'Innovation and You', 'is_featured': False},
        ]

        for brand_data in brands_data:
            brand, created = Brand.objects.update_or_create(
                slug=brand_data['slug'],
                defaults={
                    'name': brand_data['name'],
                    'description': brand_data.get('description', ''),
                    'is_featured': brand_data.get('is_featured', False),
                }
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(f"  {action}: {brand.name}")

    @transaction.atomic
    def seed_shipping_options(self):
        """Create shipping options"""

        shipping_data = [
            {
                'name': 'Standard Shipping',
                'description': 'Reliable delivery at an affordable price',
                'price': 4.99,
                'estimated_days_min': 5,
                'estimated_days_max': 7,
                'is_default': True,
                'free_shipping_threshold': 50.00,
                'display_order': 1,
            },
            {
                'name': 'Express Shipping',
                'description': 'Fast delivery for when you need it quick',
                'price': 12.99,
                'estimated_days_min': 2,
                'estimated_days_max': 3,
                'is_default': False,
                'free_shipping_threshold': 100.00,
                'display_order': 2,
            },
            {
                'name': 'Next Day Delivery',
                'description': 'Get it tomorrow! Order before 2PM',
                'price': 19.99,
                'estimated_days_min': 1,
                'estimated_days_max': 1,
                'is_default': False,
                'free_shipping_threshold': None,
                'display_order': 3,
            },
            {
                'name': 'Free Pickup',
                'description': 'Pick up from our partner stores',
                'price': 0,
                'estimated_days_min': 3,
                'estimated_days_max': 5,
                'is_default': False,
                'free_shipping_threshold': None,
                'display_order': 4,
            },
            {
                'name': 'International Shipping',
                'description': 'Worldwide delivery',
                'price': 24.99,
                'estimated_days_min': 7,
                'estimated_days_max': 14,
                'is_default': False,
                'free_shipping_threshold': 150.00,
                'regions': 'worldwide',
                'display_order': 5,
            },
        ]

        for ship_data in shipping_data:
            ship, created = ShippingOption.objects.update_or_create(
                name=ship_data['name'],
                defaults=ship_data
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(f"  {action}: {ship.name}")