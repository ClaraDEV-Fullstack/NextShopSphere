# products/management/commands/seed_products.py

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify
from products.models import Product, ProductImage, ProductSpecification, Category, Brand
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Seeds the database with sample products for all categories'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing products before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing products...')
            ProductSpecification.objects.all().delete()
            ProductImage.objects.all().delete()
            Product.objects.all().delete()
            self.stdout.write(self.style.WARNING('  Cleared all products'))

        self.stdout.write('Seeding products...')
        self.seed_products()
        self.stdout.write(self.style.SUCCESS('✅ Products seeded successfully!'))

    def get_brand(self, brand_name):
        """Get or create a brand"""
        if not brand_name:
            return None
        brand, _ = Brand.objects.get_or_create(
            slug=slugify(brand_name),
            defaults={'name': brand_name}
        )
        return brand

    def get_category(self, category_slug):
        """Get category by slug"""
        try:
            return Category.objects.get(slug=category_slug)
        except Category.DoesNotExist:
            self.stdout.write(self.style.WARNING(f'  Category not found: {category_slug}'))
            return None

    @transaction.atomic
    def seed_products(self):
        """Create sample products for all categories"""

        # Product data organized by main category -> subcategory
        products_data = {
            # ==================== ELECTRONICS ====================
            'electronics': {
                'smartphones': [
                    {
                        'name': 'iPhone 15 Pro Max',
                        'brand': 'Apple',
                        'price': 1199.99,
                        'compare_price': 1299.99,
                        'short_description': 'The most powerful iPhone ever with A17 Pro chip.',
                        'description': 'Experience the pinnacle of smartphone technology with the iPhone 15 Pro Max. Featuring the groundbreaking A17 Pro chip, a stunning 6.7-inch Super Retina XDR display, and an advanced camera system with 5x optical zoom.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.22,
                        'specifications': [
                            {'name': 'Display', 'value': '6.7-inch Super Retina XDR'},
                            {'name': 'Chip', 'value': 'A17 Pro'},
                            {'name': 'Storage', 'value': '256GB'},
                            {'name': 'Camera', 'value': '48MP Main + 12MP Ultra Wide + 12MP Telephoto'},
                            {'name': 'Battery', 'value': 'Up to 29 hours video playback'},
                        ]
                    },
                    {
                        'name': 'Samsung Galaxy S24 Ultra',
                        'brand': 'Samsung',
                        'price': 1299.99,
                        'compare_price': 1399.99,
                        'short_description': 'Ultimate Galaxy experience with S Pen and AI features.',
                        'description': 'The Samsung Galaxy S24 Ultra sets a new standard with its integrated S Pen, 200MP camera, and Galaxy AI features. Titanium design meets powerful performance.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.23,
                        'specifications': [
                            {'name': 'Display', 'value': '6.8-inch QHD+ Dynamic AMOLED'},
                            {'name': 'Processor', 'value': 'Snapdragon 8 Gen 3'},
                            {'name': 'Storage', 'value': '256GB'},
                            {'name': 'Camera', 'value': '200MP + 12MP + 50MP + 10MP'},
                        ]
                    },
                    {
                        'name': 'Google Pixel 8 Pro',
                        'brand': 'Google',
                        'price': 999.00,
                        'short_description': 'The best of Google AI in a premium smartphone.',
                        'description': 'Google Pixel 8 Pro brings you the best of Google AI with Magic Eraser, Photo Unblur, and real-time translation. 7 years of OS and security updates.',
                        'featured': True,
                        'weight': 0.21,
                        'specifications': [
                            {'name': 'Display', 'value': '6.7-inch LTPO OLED'},
                            {'name': 'Chip', 'value': 'Google Tensor G3'},
                            {'name': 'Camera', 'value': '50MP + 48MP + 48MP'},
                        ]
                    },
                    {
                        'name': 'OnePlus 12',
                        'brand': 'OnePlus',
                        'price': 799.99,
                        'compare_price': 899.99,
                        'short_description': 'Flagship killer with Hasselblad camera.',
                        'description': 'The OnePlus 12 delivers flagship performance at a competitive price. Features a Hasselblad camera system and 100W fast charging.',
                        'specifications': [
                            {'name': 'Display', 'value': '6.82-inch 2K LTPO AMOLED'},
                            {'name': 'Processor', 'value': 'Snapdragon 8 Gen 3'},
                            {'name': 'Charging', 'value': '100W SUPERVOOC'},
                        ]
                    },
                ],
                'laptops-computers': [
                    {
                        'name': 'MacBook Pro 16" M3 Max',
                        'brand': 'Apple',
                        'price': 3499.00,
                        'compare_price': 3699.00,
                        'short_description': 'The most powerful MacBook Pro ever made.',
                        'description': 'Supercharged by M3 Max, MacBook Pro delivers exceptional performance for demanding workflows. Up to 22 hours of battery life.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 2.14,
                        'specifications': [
                            {'name': 'Chip', 'value': 'Apple M3 Max'},
                            {'name': 'Memory', 'value': '36GB Unified Memory'},
                            {'name': 'Storage', 'value': '1TB SSD'},
                            {'name': 'Display', 'value': '16.2-inch Liquid Retina XDR'},
                        ]
                    },
                    {
                        'name': 'Dell XPS 15',
                        'brand': 'Dell',
                        'price': 1799.99,
                        'short_description': 'Premium Windows laptop with stunning display.',
                        'description': 'The Dell XPS 15 combines power and portability with a beautiful 15.6-inch OLED display and latest Intel processors.',
                        'featured': True,
                        'weight': 1.86,
                        'specifications': [
                            {'name': 'Processor', 'value': 'Intel Core i7-13700H'},
                            {'name': 'Memory', 'value': '16GB DDR5'},
                            {'name': 'Storage', 'value': '512GB SSD'},
                            {'name': 'Graphics', 'value': 'NVIDIA RTX 4050'},
                        ]
                    },
                    {
                        'name': 'ASUS ROG Zephyrus G14',
                        'brand': 'ASUS',
                        'price': 1599.99,
                        'compare_price': 1799.99,
                        'short_description': 'Compact gaming powerhouse.',
                        'description': 'The ROG Zephyrus G14 packs incredible gaming performance into a compact 14-inch chassis with AMD Ryzen 9 and RTX 4060.',
                        'is_bestseller': True,
                        'weight': 1.72,
                        'specifications': [
                            {'name': 'Processor', 'value': 'AMD Ryzen 9 7940HS'},
                            {'name': 'Graphics', 'value': 'NVIDIA RTX 4060'},
                            {'name': 'Display', 'value': '14-inch 165Hz QHD+'},
                        ]
                    },
                ],
                'headphones-audio': [
                    {
                        'name': 'Sony WH-1000XM5',
                        'brand': 'Sony',
                        'price': 349.99,
                        'compare_price': 399.99,
                        'short_description': 'Industry-leading noise cancellation.',
                        'description': 'The Sony WH-1000XM5 offers best-in-class noise cancellation, exceptional sound quality, and up to 30 hours of battery life.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.25,
                        'specifications': [
                            {'name': 'Driver', 'value': '30mm'},
                            {'name': 'Battery Life', 'value': '30 hours'},
                            {'name': 'Noise Cancellation', 'value': 'Active (8 microphones)'},
                        ]
                    },
                    {
                        'name': 'AirPods Pro 2',
                        'brand': 'Apple',
                        'price': 249.00,
                        'short_description': 'Magical audio experience with Active Noise Cancellation.',
                        'description': 'AirPods Pro 2 feature the H2 chip, Adaptive Transparency, and Personalized Spatial Audio for an immersive experience.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.05,
                        'specifications': [
                            {'name': 'Chip', 'value': 'Apple H2'},
                            {'name': 'Battery Life', 'value': '6 hours (30 with case)'},
                            {'name': 'Features', 'value': 'ANC, Transparency Mode'},
                        ]
                    },
                    {
                        'name': 'Bose QuietComfort Ultra',
                        'brand': 'Bose',
                        'price': 429.00,
                        'short_description': 'World-class noise cancellation meets immersive audio.',
                        'description': 'Experience Bose Immersive Audio and world-class noise cancellation in a comfortable, premium design.',
                        'featured': True,
                        'weight': 0.25,
                        'specifications': [
                            {'name': 'Battery Life', 'value': '24 hours'},
                            {'name': 'Audio', 'value': 'Bose Immersive Audio'},
                        ]
                    },
                ],
                'smart-watches': [
                    {
                        'name': 'Apple Watch Ultra 2',
                        'brand': 'Apple',
                        'price': 799.00,
                        'short_description': 'The most rugged and capable Apple Watch.',
                        'description': 'Built for endurance athletes, outdoor adventurers, and ocean explorers. Features the brightest Apple display ever.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.06,
                        'specifications': [
                            {'name': 'Case', 'value': '49mm Titanium'},
                            {'name': 'Battery', 'value': 'Up to 36 hours'},
                            {'name': 'Water Resistance', 'value': '100m'},
                        ]
                    },
                    {
                        'name': 'Samsung Galaxy Watch 6 Classic',
                        'brand': 'Samsung',
                        'price': 429.99,
                        'short_description': 'Premium smartwatch with rotating bezel.',
                        'description': 'The Galaxy Watch 6 Classic brings back the beloved rotating bezel with advanced health monitoring features.',
                        'specifications': [
                            {'name': 'Display', 'value': '1.5-inch Super AMOLED'},
                            {'name': 'Battery', 'value': '425mAh'},
                        ]
                    },
                ],
                'gaming': [
                    {
                        'name': 'PlayStation 5',
                        'brand': 'Sony',
                        'price': 499.99,
                        'short_description': 'Experience lightning-fast loading with ultra-high speed SSD.',
                        'description': 'The PS5 console unleashes new gaming possibilities with ray tracing, 4K gaming, and the innovative DualSense controller.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 4.5,
                        'specifications': [
                            {'name': 'Storage', 'value': '825GB SSD'},
                            {'name': 'Resolution', 'value': 'Up to 8K'},
                            {'name': 'Frame Rate', 'value': 'Up to 120fps'},
                        ]
                    },
                    {
                        'name': 'Xbox Series X',
                        'brand': 'Microsoft',
                        'price': 499.99,
                        'short_description': 'The fastest, most powerful Xbox ever.',
                        'description': 'Experience 12 teraflops of raw graphic processing power, true 4K gaming, and Quick Resume.',
                        'featured': True,
                        'weight': 4.45,
                        'specifications': [
                            {'name': 'Storage', 'value': '1TB SSD'},
                            {'name': 'Resolution', 'value': 'Up to 8K'},
                        ]
                    },
                    {
                        'name': 'Nintendo Switch OLED',
                        'brand': 'Nintendo',
                        'price': 349.99,
                        'short_description': 'Vibrant 7-inch OLED screen for handheld gaming.',
                        'description': 'Experience enhanced audio and a vibrant 7-inch OLED screen whether playing at home or on the go.',
                        'is_bestseller': True,
                        'weight': 0.42,
                        'specifications': [
                            {'name': 'Screen', 'value': '7-inch OLED'},
                            {'name': 'Storage', 'value': '64GB'},
                        ]
                    },
                ],
            },

            # ==================== FASHION ====================
            'fashion': {
                'mens-clothing': [
                    {
                        'name': 'Classic Fit Oxford Shirt',
                        'brand': 'Zara',
                        'price': 49.99,
                        'compare_price': 69.99,
                        'short_description': 'Timeless oxford shirt for any occasion.',
                        'description': 'A wardrobe essential crafted from premium cotton. Features a button-down collar and classic fit.',
                        'featured': True,
                        'weight': 0.3,
                        'specifications': [
                            {'name': 'Material', 'value': '100% Cotton'},
                            {'name': 'Fit', 'value': 'Classic'},
                            {'name': 'Care', 'value': 'Machine Washable'},
                        ]
                    },
                    {
                        'name': 'Slim Fit Chino Pants',
                        'brand': 'H&M',
                        'price': 39.99,
                        'short_description': 'Versatile chinos for work or weekend.',
                        'description': 'Modern slim-fit chinos in stretch cotton twill. Perfect for both casual and smart-casual looks.',
                        'is_bestseller': True,
                        'weight': 0.4,
                        'specifications': [
                            {'name': 'Material', 'value': '98% Cotton, 2% Elastane'},
                            {'name': 'Fit', 'value': 'Slim'},
                        ]
                    },
                    {
                        'name': 'Wool Blend Overcoat',
                        'brand': 'Zara',
                        'price': 189.99,
                        'compare_price': 249.99,
                        'short_description': 'Sophisticated overcoat for cold weather.',
                        'description': 'Elegant wool-blend overcoat with notch lapels. A timeless piece for your winter wardrobe.',
                        'featured': True,
                        'weight': 1.2,
                        'specifications': [
                            {'name': 'Material', 'value': '70% Wool, 30% Polyester'},
                            {'name': 'Length', 'value': 'Mid-thigh'},
                        ]
                    },
                ],
                'womens-clothing': [
                    {
                        'name': 'Floral Midi Dress',
                        'brand': 'Zara',
                        'price': 79.99,
                        'compare_price': 99.99,
                        'short_description': 'Elegant floral dress for any season.',
                        'description': 'Beautiful midi dress with delicate floral print. Features a flattering A-line silhouette and puff sleeves.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.35,
                        'specifications': [
                            {'name': 'Material', 'value': '100% Viscose'},
                            {'name': 'Length', 'value': 'Midi'},
                            {'name': 'Fit', 'value': 'Regular'},
                        ]
                    },
                    {
                        'name': 'High-Rise Skinny Jeans',
                        'brand': 'Zara',
                        'price': 59.99,
                        'short_description': 'Perfect everyday skinny jeans.',
                        'description': 'Classic high-rise skinny jeans in premium stretch denim. Flattering fit that moves with you.',
                        'is_bestseller': True,
                        'weight': 0.45,
                        'specifications': [
                            {'name': 'Material', 'value': '92% Cotton, 6% Polyester, 2% Elastane'},
                            {'name': 'Rise', 'value': 'High'},
                        ]
                    },
                    {
                        'name': 'Cashmere Blend Sweater',
                        'brand': 'H&M',
                        'price': 89.99,
                        'compare_price': 129.99,
                        'short_description': 'Luxuriously soft cashmere blend.',
                        'description': 'Cozy cashmere-blend sweater with ribbed details. Perfect layering piece for cooler days.',
                        'featured': True,
                        'weight': 0.3,
                        'specifications': [
                            {'name': 'Material', 'value': '50% Cashmere, 50% Wool'},
                        ]
                    },
                ],
                'footwear': [
                    {
                        'name': 'Air Max 270',
                        'brand': 'Nike',
                        'price': 150.00,
                        'short_description': 'Iconic comfort meets street style.',
                        'description': 'The Nike Air Max 270 delivers visible cushioning under every step with its large Air unit.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.35,
                        'specifications': [
                            {'name': 'Sole', 'value': 'Air Max Unit'},
                            {'name': 'Upper', 'value': 'Mesh + Synthetic'},
                        ]
                    },
                    {
                        'name': 'Ultraboost 22',
                        'brand': 'Adidas',
                        'price': 190.00,
                        'compare_price': 220.00,
                        'short_description': 'Incredible energy return with every stride.',
                        'description': 'Experience incredible energy return with Boost midsole technology. Primeknit upper adapts to your foot.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.32,
                        'specifications': [
                            {'name': 'Technology', 'value': 'Boost Midsole'},
                            {'name': 'Upper', 'value': 'Primeknit'},
                        ]
                    },
                    {
                        'name': 'Classic Leather Chelsea Boot',
                        'brand': 'Zara',
                        'price': 129.99,
                        'short_description': 'Timeless Chelsea boot in genuine leather.',
                        'description': 'Classic Chelsea boot crafted from genuine leather. Features elastic side panels and pull tab.',
                        'weight': 0.8,
                        'specifications': [
                            {'name': 'Material', 'value': '100% Leather'},
                            {'name': 'Sole', 'value': 'Rubber'},
                        ]
                    },
                ],
                'bags-luggage': [
                    {
                        'name': 'Leather Tote Bag',
                        'brand': 'Gucci',
                        'price': 299.99,
                        'compare_price': 399.99,
                        'short_description': 'Spacious tote for work and weekend.',
                        'description': 'Elegant leather tote with spacious interior. Perfect for carrying laptop, documents, and daily essentials.',
                        'featured': True,
                        'weight': 0.8,
                        'specifications': [
                            {'name': 'Material', 'value': 'Genuine Leather'},
                            {'name': 'Dimensions', 'value': '40 x 30 x 15 cm'},
                        ]
                    },
                    {
                        'name': 'Travel Backpack 40L',
                        'brand': 'Nike',
                        'price': 89.99,
                        'short_description': 'Versatile backpack for travel and daily use.',
                        'description': 'Durable travel backpack with laptop compartment, multiple pockets, and ergonomic straps.',
                        'is_bestseller': True,
                        'weight': 1.2,
                        'specifications': [
                            {'name': 'Capacity', 'value': '40 Liters'},
                            {'name': 'Laptop', 'value': 'Up to 17 inch'},
                        ]
                    },
                ],
            },

            # ==================== HOME & LIVING ====================
            'home-living': {
                'furniture': [
                    {
                        'name': 'Modern Sectional Sofa',
                        'brand': 'IKEA',
                        'price': 1299.00,
                        'compare_price': 1599.00,
                        'short_description': 'Contemporary L-shaped sectional for modern living.',
                        'description': 'Spacious sectional sofa with reversible chaise. Features high-density foam cushions and durable fabric upholstery.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 85,
                        'specifications': [
                            {'name': 'Dimensions', 'value': '280 x 180 x 85 cm'},
                            {'name': 'Material', 'value': 'Polyester Blend'},
                            {'name': 'Seats', 'value': '5-6 people'},
                        ]
                    },
                    {
                        'name': 'Solid Oak Dining Table',
                        'brand': 'IKEA',
                        'price': 699.00,
                        'short_description': 'Elegant dining table for 6-8 people.',
                        'description': 'Beautifully crafted dining table in solid oak. Sturdy construction with elegant design.',
                        'featured': True,
                        'weight': 45,
                        'specifications': [
                            {'name': 'Dimensions', 'value': '180 x 90 x 75 cm'},
                            {'name': 'Material', 'value': 'Solid Oak'},
                            {'name': 'Capacity', 'value': '6-8 people'},
                        ]
                    },
                    {
                        'name': 'Ergonomic Office Chair',
                        'brand': 'IKEA',
                        'price': 349.00,
                        'compare_price': 449.00,
                        'short_description': 'All-day comfort for home office.',
                        'description': 'Ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh back.',
                        'is_bestseller': True,
                        'weight': 18,
                        'specifications': [
                            {'name': 'Adjustable Height', 'value': '42-52 cm'},
                            {'name': 'Weight Capacity', 'value': '120 kg'},
                        ]
                    },
                ],
                'lighting': [
                    {
                        'name': 'Modern LED Floor Lamp',
                        'brand': 'Philips',
                        'price': 149.99,
                        'short_description': 'Adjustable LED floor lamp with dimmer.',
                        'description': 'Contemporary floor lamp with adjustable brightness and color temperature. Energy-efficient LED technology.',
                        'featured': True,
                        'weight': 5,
                        'specifications': [
                            {'name': 'Wattage', 'value': '20W LED'},
                            {'name': 'Color Temperature', 'value': '2700K-6500K'},
                            {'name': 'Height', 'value': '180 cm'},
                        ]
                    },
                    {
                        'name': 'Smart Ceiling Light',
                        'brand': 'Philips',
                        'price': 89.99,
                        'short_description': 'WiFi-enabled smart ceiling light.',
                        'description': 'Smart ceiling light compatible with Alexa and Google Home. Control brightness and color from your phone.',
                        'is_bestseller': True,
                        'weight': 2,
                        'specifications': [
                            {'name': 'Wattage', 'value': '32W LED'},
                            {'name': 'Diameter', 'value': '45 cm'},
                            {'name': 'Smart Features', 'value': 'WiFi, Voice Control'},
                        ]
                    },
                ],
                'kitchen-dining': [
                    {
                        'name': 'Professional Chef Knife Set',
                        'brand': None,
                        'price': 199.99,
                        'compare_price': 299.99,
                        'short_description': '8-piece German steel knife set.',
                        'description': 'Professional-grade knife set forged from high-carbon German steel. Includes chef knife, bread knife, utility knife, and more.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 3,
                        'specifications': [
                            {'name': 'Pieces', 'value': '8'},
                            {'name': 'Material', 'value': 'German Steel'},
                            {'name': 'Block', 'value': 'Acacia Wood'},
                        ]
                    },
                    {
                        'name': 'Cast Iron Dutch Oven',
                        'brand': None,
                        'price': 89.99,
                        'short_description': 'Enameled cast iron for perfect cooking.',
                        'description': '6-quart enameled cast iron Dutch oven. Perfect for soups, stews, roasts, and baking bread.',
                        'is_bestseller': True,
                        'weight': 6,
                        'specifications': [
                            {'name': 'Capacity', 'value': '6 Quarts'},
                            {'name': 'Material', 'value': 'Enameled Cast Iron'},
                        ]
                    },
                ],
                'bedding': [
                    {
                        'name': 'Luxury Egyptian Cotton Sheet Set',
                        'brand': None,
                        'price': 149.99,
                        'compare_price': 199.99,
                        'short_description': '1000 thread count pure luxury.',
                        'description': 'Experience hotel-quality comfort with our 1000 thread count Egyptian cotton sheets. Includes flat sheet, fitted sheet, and 2 pillowcases.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 2,
                        'specifications': [
                            {'name': 'Thread Count', 'value': '1000'},
                            {'name': 'Material', 'value': '100% Egyptian Cotton'},
                            {'name': 'Pieces', 'value': '4'},
                        ]
                    },
                    {
                        'name': 'Memory Foam Pillow Set',
                        'brand': None,
                        'price': 79.99,
                        'short_description': 'Contoured support for better sleep.',
                        'description': 'Set of 2 memory foam pillows with cooling gel layer. Ergonomic design supports neck and spine alignment.',
                        'weight': 2,
                        'specifications': [
                            {'name': 'Quantity', 'value': '2 Pillows'},
                            {'name': 'Material', 'value': 'Memory Foam with Cooling Gel'},
                        ]
                    },
                ],
            },

            # ==================== BEAUTY & SKINCARE ====================
            'beauty-skincare': {
                'skincare': [
                    {
                        'name': 'Vitamin C Brightening Serum',
                        'brand': 'CeraVe',
                        'price': 24.99,
                        'short_description': '20% Vitamin C for radiant skin.',
                        'description': 'Powerful antioxidant serum with 20% Vitamin C, Vitamin E, and Ferulic Acid. Brightens skin and reduces fine lines.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.1,
                        'specifications': [
                            {'name': 'Size', 'value': '30ml'},
                            {'name': 'Skin Type', 'value': 'All Skin Types'},
                            {'name': 'Key Ingredient', 'value': '20% Vitamin C'},
                        ]
                    },
                    {
                        'name': 'Hyaluronic Acid Moisturizer',
                        'brand': 'CeraVe',
                        'price': 19.99,
                        'short_description': 'Deep hydration for plump skin.',
                        'description': 'Lightweight moisturizer with hyaluronic acid for intense hydration. Non-comedogenic and suitable for sensitive skin.',
                        'is_bestseller': True,
                        'weight': 0.1,
                        'specifications': [
                            {'name': 'Size', 'value': '50ml'},
                            {'name': 'Skin Type', 'value': 'All Skin Types'},
                        ]
                    },
                    {
                        'name': 'Retinol Night Cream',
                        'brand': 'CeraVe',
                        'price': 34.99,
                        'compare_price': 44.99,
                        'short_description': 'Anti-aging retinol formula.',
                        'description': 'Clinically proven retinol cream that reduces wrinkles and improves skin texture overnight.',
                        'featured': True,
                        'weight': 0.1,
                        'specifications': [
                            {'name': 'Size', 'value': '50ml'},
                            {'name': 'Key Ingredient', 'value': '0.5% Retinol'},
                        ]
                    },
                ],
                'makeup': [
                    {
                        'name': 'Matte Liquid Lipstick Set',
                        'brand': 'Fenty Beauty',
                        'price': 42.00,
                        'short_description': '6 stunning shades for every mood.',
                        'description': 'Long-wearing matte liquid lipstick set featuring 6 universally flattering shades. Transfer-proof formula lasts up to 12 hours.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.15,
                        'specifications': [
                            {'name': 'Pieces', 'value': '6 Shades'},
                            {'name': 'Finish', 'value': 'Matte'},
                            {'name': 'Wear Time', 'value': '12 Hours'},
                        ]
                    },
                    {
                        'name': 'Full Coverage Foundation',
                        'brand': 'Fenty Beauty',
                        'price': 38.00,
                        'short_description': '40 shades for every skin tone.',
                        'description': 'Buildable full coverage foundation with natural matte finish. Lightweight formula that lasts all day.',
                        'is_bestseller': True,
                        'weight': 0.1,
                        'specifications': [
                            {'name': 'Size', 'value': '32ml'},
                            {'name': 'Coverage', 'value': 'Full'},
                            {'name': 'Finish', 'value': 'Natural Matte'},
                        ]
                    },
                    {
                        'name': 'Eyeshadow Palette - Neutrals',
                        'brand': 'Fenty Beauty',
                        'price': 54.00,
                        'compare_price': 65.00,
                        'short_description': '18 versatile neutral shades.',
                        'description': 'Curated palette of 18 highly pigmented eyeshadows in matte, shimmer, and metallic finishes.',
                        'featured': True,
                        'weight': 0.2,
                        'specifications': [
                            {'name': 'Shades', 'value': '18'},
                            {'name': 'Finishes', 'value': 'Matte, Shimmer, Metallic'},
                        ]
                    },
                ],
                'fragrances': [
                    {
                        'name': 'Sauvage Eau de Parfum',
                        'brand': 'Dior',
                        'price': 135.00,
                        'short_description': 'Fresh and woody masculine fragrance.',
                        'description': 'Iconic fragrance with notes of bergamot, pepper, and ambroxan. Long-lasting and versatile.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.3,
                        'specifications': [
                            {'name': 'Size', 'value': '100ml'},
                            {'name': 'Type', 'value': 'Eau de Parfum'},
                            {'name': 'Notes', 'value': 'Bergamot, Pepper, Ambroxan'},
                        ]
                    },
                    {
                        'name': 'Miss Dior Blooming Bouquet',
                        'brand': 'Dior',
                        'price': 115.00,
                        'short_description': 'Fresh and floral feminine fragrance.',
                        'description': 'Delicate floral fragrance with notes of peony, rose, and white musk. Fresh and romantic.',
                        'featured': True,
                        'weight': 0.3,
                        'specifications': [
                            {'name': 'Size', 'value': '100ml'},
                            {'name': 'Type', 'value': 'Eau de Toilette'},
                        ]
                    },
                ],
                'hair-care': [
                    {
                        'name': 'Argan Oil Hair Treatment',
                        'brand': "L'Oreal",
                        'price': 29.99,
                        'short_description': 'Nourishing treatment for silky hair.',
                        'description': 'Luxurious argan oil treatment that transforms dry, damaged hair. Adds shine and reduces frizz.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.15,
                        'specifications': [
                            {'name': 'Size', 'value': '100ml'},
                            {'name': 'Hair Type', 'value': 'All Types'},
                        ]
                    },
                    {
                        'name': 'Professional Hair Dryer',
                        'brand': None,
                        'price': 159.99,
                        'compare_price': 199.99,
                        'short_description': 'Salon-quality drying at home.',
                        'description': 'Professional ionic hair dryer with multiple heat and speed settings. Includes concentrator and diffuser attachments.',
                        'weight': 0.6,
                        'specifications': [
                            {'name': 'Wattage', 'value': '2000W'},
                            {'name': 'Technology', 'value': 'Ionic'},
                            {'name': 'Attachments', 'value': 'Concentrator, Diffuser'},
                        ]
                    },
                ],
            },

            # ==================== BOOKS & EDUCATION ====================
            'books-education': {
                'fiction': [
                    {
                        'name': 'Fourth Wing',
                        'brand': None,
                        'price': 21.99,
                        'short_description': 'A dragon rider romantasy adventure.',
                        'description': 'Twenty-year-old Violet Sorrengail was supposed to enter the Scribe Quadrant, but the commanding general has ordered her into the riders quadrant, where dragons may bond with humans.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.5,
                        'specifications': [
                            {'name': 'Format', 'value': 'Hardcover'},
                            {'name': 'Pages', 'value': '512'},
                            {'name': 'Genre', 'value': 'Fantasy Romance'},
                        ]
                    },
                    {
                        'name': 'A Court of Thorns and Roses',
                        'brand': None,
                        'price': 18.99,
                        'short_description': 'Epic fantasy retelling of Beauty and the Beast.',
                        'description': 'When nineteen-year-old huntress Feyre kills a wolf in the woods, a terrifying creature arrives to demand retribution.',
                        'is_bestseller': True,
                        'weight': 0.45,
                        'specifications': [
                            {'name': 'Format', 'value': 'Paperback'},
                            {'name': 'Pages', 'value': '432'},
                        ]
                    },
                    {
                        'name': 'Tomorrow, and Tomorrow, and Tomorrow',
                        'brand': None,
                        'price': 24.00,
                        'short_description': 'A story of creativity and love.',
                        'description': 'Sam and Sadie meet as kids and bond over video games. Decades later, they create a groundbreaking game together.',
                        'featured': True,
                        'weight': 0.4,
                        'specifications': [
                            {'name': 'Format', 'value': 'Hardcover'},
                            {'name': 'Pages', 'value': '416'},
                        ]
                    },
                    {
                        'name': 'Project Hail Mary',
                        'brand': None,
                        'price': 18.99,
                        'compare_price': 24.99,
                        'short_description': 'A lone astronaut must save Earth.',
                        'description': 'Ryland Grace is the sole survivor on a desperate, last-chance mission. He must figure out how to save humanity.',
                        'weight': 0.45,
                        'specifications': [
                            {'name': 'Format', 'value': 'Paperback'},
                            {'name': 'Genre', 'value': 'Science Fiction'},
                        ]
                    },
                ],
                'non-fiction': [
                    {
                        'name': 'Atomic Habits',
                        'brand': None,
                        'price': 18.99,
                        'short_description': 'Build good habits, break bad ones.',
                        'description': 'James Clear reveals practical strategies to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.4,
                        'specifications': [
                            {'name': 'Format', 'value': 'Paperback'},
                            {'name': 'Pages', 'value': '320'},
                            {'name': 'Category', 'value': 'Self-improvement'},
                        ]
                    },
                    {
                        'name': 'Sapiens: A Brief History of Humankind',
                        'brand': None,
                        'price': 22.99,
                        'short_description': 'How we came to dominate the world.',
                        'description': 'Yuval Noah Harari explores how Homo sapiens came to dominate Earth through cognitive, agricultural, and scientific revolutions.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.5,
                        'specifications': [
                            {'name': 'Format', 'value': 'Paperback'},
                            {'name': 'Pages', 'value': '464'},
                        ]
                    },
                    {
                        'name': 'Educated: A Memoir',
                        'brand': None,
                        'price': 17.00,
                        'short_description': 'A powerful memoir of self-invention.',
                        'description': 'Born to survivalists in the mountains of Idaho, Tara Westover was seventeen when she first set foot in a classroom.',
                        'weight': 0.4,
                        'specifications': [
                            {'name': 'Format', 'value': 'Paperback'},
                            {'name': 'Category', 'value': 'Memoir'},
                        ]
                    },
                    {
                        'name': 'The Psychology of Money',
                        'brand': None,
                        'price': 19.99,
                        'short_description': 'Timeless lessons on wealth and happiness.',
                        'description': 'Morgan Housel shares 19 short stories exploring the strange ways people think about money.',
                        'is_bestseller': True,
                        'weight': 0.35,
                        'specifications': [
                            {'name': 'Format', 'value': 'Paperback'},
                            {'name': 'Pages', 'value': '256'},
                        ]
                    },
                ],
                'self-help': [
                    {
                        'name': 'The 7 Habits of Highly Effective People',
                        'brand': None,
                        'price': 17.99,
                        'short_description': 'Powerful lessons in personal change.',
                        'description': 'Stephen R. Covey presents a holistic approach to solving personal and professional problems.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.4,
                        'specifications': [
                            {'name': 'Format', 'value': 'Paperback'},
                            {'name': 'Pages', 'value': '381'},
                        ]
                    },
                    {
                        'name': 'Think and Grow Rich',
                        'brand': None,
                        'price': 9.99,
                        'short_description': 'The classic success manual.',
                        'description': 'Napoleon Hill reveals the secrets behind the wealth of the most successful industrialists of his time.',
                        'weight': 0.3,
                        'specifications': [
                            {'name': 'Format', 'value': 'Paperback'},
                            {'name': 'Pages', 'value': '320'},
                        ]
                    },
                ],
                'technology-books': [
                    {
                        'name': 'Clean Code: A Handbook',
                        'brand': None,
                        'price': 44.99,
                        'short_description': 'Write better, cleaner code.',
                        'description': 'Robert C. Martin presents best practices for writing readable, maintainable, and efficient code.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.6,
                        'specifications': [
                            {'name': 'Format', 'value': 'Paperback'},
                            {'name': 'Pages', 'value': '464'},
                        ]
                    },
                    {
                        'name': 'The Pragmatic Programmer',
                        'brand': None,
                        'price': 49.99,
                        'short_description': 'Your journey to mastery.',
                        'description': 'Practical advice on software development, from code organization to career development.',
                        'is_bestseller': True,
                        'weight': 0.55,
                        'specifications': [
                            {'name': 'Format', 'value': 'Hardcover'},
                            {'name': 'Pages', 'value': '352'},
                        ]
                    },
                ],
            },

            # ==================== SPORTS & FITNESS ====================
            'sports-fitness': {
                'exercise-equipment': [
                    {
                        'name': 'Adjustable Dumbbell Set',
                        'brand': None,
                        'price': 349.99,
                        'compare_price': 449.99,
                        'short_description': 'Replace 15 sets of dumbbells.',
                        'description': 'Adjustable dumbbells from 5-52.5 lbs each. Quick-change weight selection for efficient workouts.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 25,
                        'specifications': [
                            {'name': 'Weight Range', 'value': '5-52.5 lbs each'},
                            {'name': 'Increments', 'value': '2.5 lbs'},
                            {'name': 'Material', 'value': 'Steel with Rubber Coating'},
                        ]
                    },
                    {
                        'name': 'Premium Yoga Mat',
                        'brand': None,
                        'price': 79.99,
                        'short_description': 'Non-slip mat for yoga and fitness.',
                        'description': 'Extra thick 6mm yoga mat with non-slip surface. Eco-friendly TPE material with alignment lines.',
                        'is_bestseller': True,
                        'weight': 1.2,
                        'specifications': [
                            {'name': 'Thickness', 'value': '6mm'},
                            {'name': 'Material', 'value': 'TPE (Eco-Friendly)'},
                            {'name': 'Size', 'value': '183 x 61 cm'},
                        ]
                    },
                    {
                        'name': 'Resistance Bands Set',
                        'brand': None,
                        'price': 29.99,
                        'short_description': '5 resistance levels for full body workout.',
                        'description': 'Complete set of 5 resistance bands with different tension levels. Includes door anchor, handles, and ankle straps.',
                        'weight': 0.5,
                        'specifications': [
                            {'name': 'Bands', 'value': '5 Resistance Levels'},
                            {'name': 'Accessories', 'value': 'Door Anchor, Handles, Ankle Straps'},
                        ]
                    },
                    {
                        'name': 'Folding Treadmill',
                        'brand': None,
                        'price': 599.99,
                        'compare_price': 799.99,
                        'short_description': 'Space-saving cardio machine.',
                        'description': 'Compact folding treadmill with 12 preset programs, up to 12 km/h speed, and heart rate monitor.',
                        'featured': True,
                        'weight': 45,
                        'specifications': [
                            {'name': 'Max Speed', 'value': '12 km/h'},
                            {'name': 'Programs', 'value': '12 Preset'},
                            {'name': 'Display', 'value': 'LCD'},
                        ]
                    },
                ],
                'sportswear': [
                    {
                        'name': 'Performance Running Shoes',
                        'brand': 'Nike',
                        'price': 129.99,
                        'short_description': 'Lightweight and responsive running shoes.',
                        'description': 'Engineered for speed with responsive foam and breathable mesh upper. Perfect for daily training and races.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 0.25,
                        'specifications': [
                            {'name': 'Drop', 'value': '10mm'},
                            {'name': 'Cushioning', 'value': 'Responsive Foam'},
                        ]
                    },
                    {
                        'name': 'Compression Leggings',
                        'brand': 'Adidas',
                        'price': 65.00,
                        'short_description': 'High-performance compression wear.',
                        'description': 'Moisture-wicking compression leggings with 4-way stretch. High waist with hidden pocket.',
                        'is_bestseller': True,
                        'weight': 0.2,
                        'specifications': [
                            {'name': 'Material', 'value': 'Nylon/Spandex Blend'},
                            {'name': 'Features', 'value': 'High Waist, Hidden Pocket'},
                        ]
                    },
                    {
                        'name': 'Breathable Training Tee',
                        'brand': 'Under Armour',
                        'price': 35.00,
                        'short_description': 'Stay cool during intense workouts.',
                        'description': 'Ultra-light, breathable training t-shirt with anti-odor technology and 4-way stretch fabric.',
                        'weight': 0.15,
                        'specifications': [
                            {'name': 'Material', 'value': '100% Polyester'},
                            {'name': 'Technology', 'value': 'Anti-Odor'},
                        ]
                    },
                ],
                'supplements': [
                    {
                        'name': 'Whey Protein Isolate',
                        'brand': None,
                        'price': 54.99,
                        'compare_price': 69.99,
                        'short_description': '25g protein per serving, low carb.',
                        'description': 'Premium whey protein isolate with 25g protein per serving. Low carb, low fat, and fast absorbing.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 2,
                        'specifications': [
                            {'name': 'Protein per Serving', 'value': '25g'},
                            {'name': 'Servings', 'value': '30'},
                            {'name': 'Flavors', 'value': 'Chocolate, Vanilla, Strawberry'},
                        ]
                    },
                    {
                        'name': 'Pre-Workout Energy',
                        'brand': None,
                        'price': 39.99,
                        'short_description': 'Explosive energy and focus.',
                        'description': 'Powerful pre-workout formula with caffeine, beta-alanine, and citrulline for enhanced performance.',
                        'weight': 0.4,
                        'specifications': [
                            {'name': 'Caffeine', 'value': '200mg'},
                            {'name': 'Servings', 'value': '30'},
                        ]
                    },
                    {
                        'name': 'BCAA Recovery',
                        'brand': None,
                        'price': 29.99,
                        'short_description': 'Muscle recovery and endurance.',
                        'description': 'Branch chain amino acids (2:1:1 ratio) for muscle recovery, reduced fatigue, and improved endurance.',
                        'weight': 0.35,
                        'specifications': [
                            {'name': 'BCAA Ratio', 'value': '2:1:1'},
                            {'name': 'Servings', 'value': '30'},
                        ]
                    },
                ],
                'yoga-pilates': [
                    {
                        'name': 'Cork Yoga Block Set',
                        'brand': None,
                        'price': 24.99,
                        'short_description': 'Eco-friendly cork yoga blocks.',
                        'description': 'Set of 2 premium cork yoga blocks. Sustainable, non-slip, and firm support for all yoga levels.',
                        'is_bestseller': True,
                        'weight': 0.8,
                        'specifications': [
                            {'name': 'Material', 'value': 'Natural Cork'},
                            {'name': 'Size', 'value': '23 x 15 x 10 cm'},
                            {'name': 'Quantity', 'value': '2 Blocks'},
                        ]
                    },
                    {
                        'name': 'Yoga Strap with Loops',
                        'brand': None,
                        'price': 14.99,
                        'short_description': 'Extend your reach in poses.',
                        'description': 'Durable cotton yoga strap with 10 loops for gradual stretching. Perfect for deepening poses.',
                        'weight': 0.2,
                        'specifications': [
                            {'name': 'Material', 'value': 'Cotton'},
                            {'name': 'Length', 'value': '2.5m'},
                            {'name': 'Loops', 'value': '10'},
                        ]
                    },
                ],
            },

            # ==================== KIDS & TOYS ====================
            'kids-toys': {
                'building-blocks': [
                    {
                        'name': 'LEGO Classic Creative Brick Box',
                        'brand': 'LEGO',
                        'price': 59.99,
                        'short_description': '790 pieces for endless creativity.',
                        'description': 'Classic LEGO brick set with 790 pieces in 33 different colors. Includes ideas booklet for inspiration.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 1.5,
                        'specifications': [
                            {'name': 'Pieces', 'value': '790'},
                            {'name': 'Age', 'value': '4+'},
                            {'name': 'Colors', 'value': '33'},
                        ]
                    },
                    {
                        'name': 'Magnetic Building Tiles',
                        'brand': None,
                        'price': 44.99,
                        'compare_price': 59.99,
                        'short_description': '100 pieces of magnetic fun.',
                        'description': 'Colorful magnetic building tiles that snap together easily. STEM learning through creative play.',
                        'is_bestseller': True,
                        'weight': 1.8,
                        'specifications': [
                            {'name': 'Pieces', 'value': '100'},
                            {'name': 'Age', 'value': '3+'},
                            {'name': 'Material', 'value': 'ABS Plastic with Magnets'},
                        ]
                    },
                ],
                'educational-toys': [
                    {
                        'name': 'STEM Robot Building Kit',
                        'brand': None,
                        'price': 69.99,
                        'short_description': 'Build and program your own robot.',
                        'description': '405-piece robot kit with remote control and programming app. Learn coding and engineering through play.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 1.2,
                        'specifications': [
                            {'name': 'Pieces', 'value': '405'},
                            {'name': 'Age', 'value': '8+'},
                            {'name': 'Features', 'value': 'Remote Control, App Programming'},
                        ]
                    },
                    {
                        'name': 'Science Experiment Kit',
                        'brand': None,
                        'price': 34.99,
                        'short_description': '20 fun science experiments.',
                        'description': 'Complete science kit with 20 experiments covering chemistry, physics, and biology. Includes all materials and guide.',
                        'weight': 1.5,
                        'specifications': [
                            {'name': 'Experiments', 'value': '20'},
                            {'name': 'Age', 'value': '6+'},
                        ]
                    },
                ],
                'dolls-playsets': [
                    {
                        'name': 'Dream Dollhouse',
                        'brand': None,
                        'price': 149.99,
                        'compare_price': 199.99,
                        'short_description': '3-story wooden dollhouse.',
                        'description': 'Beautiful 3-story wooden dollhouse with 15 furniture pieces. Working elevator and outdoor patio area.',
                        'featured': True,
                        'weight': 12,
                        'specifications': [
                            {'name': 'Floors', 'value': '3'},
                            {'name': 'Rooms', 'value': '8'},
                            {'name': 'Furniture Pieces', 'value': '15'},
                        ]
                    },
                    {
                        'name': 'Action Figure Collection',
                        'brand': None,
                        'price': 29.99,
                        'short_description': '6 poseable action figures.',
                        'description': 'Set of 6 highly detailed action figures with multiple points of articulation. Includes accessories.',
                        'is_bestseller': True,
                        'weight': 0.6,
                        'specifications': [
                            {'name': 'Figures', 'value': '6'},
                            {'name': 'Size', 'value': '15cm'},
                        ]
                    },
                ],
                'board-games': [
                    {
                        'name': 'Family Strategy Game',
                        'brand': None,
                        'price': 44.99,
                        'short_description': 'Fun strategy game for all ages.',
                        'description': 'Award-winning strategy game that the whole family can enjoy. Easy to learn, challenging to master.',
                        'featured': True,
                        'is_bestseller': True,
                        'weight': 1.2,
                        'specifications': [
                            {'name': 'Players', 'value': '2-6'},
                            {'name': 'Age', 'value': '8+'},
                            {'name': 'Play Time', 'value': '45-60 minutes'},
                        ]
                    },
                    {
                        'name': 'Classic Trivia Game',
                        'brand': None,
                        'price': 34.99,
                        'short_description': '3000 questions in 6 categories.',
                        'description': 'Test your knowledge with 3000 trivia questions across 6 categories. Perfect for game nights.',
                        'weight': 0.9,
                        'specifications': [
                            {'name': 'Questions', 'value': '3000'},
                            {'name': 'Categories', 'value': '6'},
                            {'name': 'Players', 'value': '2-36'},
                        ]
                    },
                ],
                'outdoor-play': [
                    {
                        'name': 'Kids Electric Scooter',
                        'brand': None,
                        'price': 199.99,
                        'compare_price': 249.99,
                        'short_description': 'Safe and fun electric scooter.',
                        'description': 'Electric scooter designed for kids with max speed of 10 mph. LED lights and adjustable handlebar height.',
                        'featured': True,
                        'weight': 8,
                        'specifications': [
                            {'name': 'Max Speed', 'value': '10 mph'},
                            {'name': 'Range', 'value': '8 miles'},
                            {'name': 'Age', 'value': '8+'},
                        ]
                    },
                    {
                        'name': 'Trampoline with Safety Net',
                        'brand': None,
                        'price': 299.99,
                        'short_description': '12ft trampoline with enclosure.',
                        'description': 'Large 12ft trampoline with safety enclosure net, padded poles, and rust-resistant frame.',
                        'is_bestseller': True,
                        'weight': 55,
                        'specifications': [
                            {'name': 'Diameter', 'value': '12 feet'},
                            {'name': 'Weight Capacity', 'value': '250 lbs'},
                        ]
                    },
                ],
            },

            # ==================== DIGITAL PRODUCTS ====================
            'digital-products': {
                'ebooks': [
                    {
                        'name': 'The Complete Web Development Bootcamp eBook',
                        'brand': None,
                        'price': 29.99,
                        'compare_price': 49.99,
                        'short_description': 'Master HTML, CSS, JavaScript, React, Node.js and more.',
                        'description': 'A comprehensive guide to becoming a full-stack web developer. Covers HTML5, CSS3, JavaScript ES6+, React, Node.js, MongoDB, and deployment strategies. Includes code examples and projects.',
                        'featured': True,
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Format', 'value': 'PDF, EPUB, MOBI'},
                            {'name': 'Pages', 'value': '650'},
                            {'name': 'Language', 'value': 'English'},
                            {'name': 'Last Updated', 'value': '2024'},
                        ]
                    },
                    {
                        'name': 'Python Machine Learning Handbook',
                        'brand': None,
                        'price': 34.99,
                        'compare_price': 59.99,
                        'short_description': 'From basics to advanced ML algorithms with Python.',
                        'description': 'Learn machine learning from scratch using Python. Covers NumPy, Pandas, Scikit-learn, TensorFlow, and PyTorch. Includes real-world projects and datasets.',
                        'featured': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Format', 'value': 'PDF, EPUB'},
                            {'name': 'Pages', 'value': '480'},
                            {'name': 'Skill Level', 'value': 'Intermediate'},
                        ]
                    },
                    {
                        'name': 'Digital Marketing Mastery Guide',
                        'brand': None,
                        'price': 24.99,
                        'short_description': 'Complete guide to SEO, social media, and PPC advertising.',
                        'description': 'Master digital marketing strategies including SEO, content marketing, social media advertising, email marketing, and analytics. Includes templates and checklists.',
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Format', 'value': 'PDF'},
                            {'name': 'Pages', 'value': '320'},
                            {'name': 'Bonus', 'value': '50+ Templates'},
                        ]
                    },
                ],
                'templates': [
                    {
                        'name': 'Professional Resume & CV Template Pack',
                        'brand': None,
                        'price': 19.99,
                        'compare_price': 39.99,
                        'short_description': '50+ ATS-friendly resume templates for all industries.',
                        'description': 'Stand out with professionally designed resume templates. Includes modern, creative, and traditional styles. Easy to customize in Word, Google Docs, and InDesign.',
                        'featured': True,
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Formats', 'value': 'DOCX, Google Docs, INDD'},
                            {'name': 'Templates', 'value': '50+'},
                            {'name': 'Cover Letters', 'value': 'Included'},
                        ]
                    },
                    {
                        'name': 'Social Media Content Calendar Template',
                        'brand': None,
                        'price': 14.99,
                        'short_description': 'Plan your social media content like a pro.',
                        'description': 'Comprehensive social media planning template with content calendar, hashtag tracker, analytics dashboard, and posting schedule.',
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Format', 'value': 'Excel, Google Sheets'},
                            {'name': 'Platforms', 'value': 'All Major Platforms'},
                            {'name': 'Duration', 'value': '12-Month Planner'},
                        ]
                    },
                    {
                        'name': 'Notion Life OS Template',
                        'brand': None,
                        'price': 24.99,
                        'short_description': 'All-in-one Notion system for life management.',
                        'description': 'Complete Notion template for managing goals, habits, finances, projects, and personal development. Includes tutorials and lifetime updates.',
                        'featured': True,
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Platform', 'value': 'Notion'},
                            {'name': 'Modules', 'value': '15+'},
                            {'name': 'Updates', 'value': 'Lifetime'},
                        ]
                    },
                ],
                'graphics-icons': [
                    {
                        'name': 'Ultimate Icon Bundle - 10,000+ Icons',
                        'brand': None,
                        'price': 49.99,
                        'compare_price': 99.99,
                        'short_description': 'Massive icon library for all your design needs.',
                        'description': 'Over 10,000 premium icons in multiple styles: line, solid, duotone, and colored. Includes SVG, PNG, and icon font formats.',
                        'featured': True,
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Icons', 'value': '10,000+'},
                            {'name': 'Formats', 'value': 'SVG, PNG, Icon Font'},
                            {'name': 'Styles', 'value': 'Line, Solid, Duotone'},
                            {'name': 'License', 'value': 'Commercial Use'},
                        ]
                    },
                    {
                        'name': '3D Illustration Pack - Characters',
                        'brand': None,
                        'price': 39.99,
                        'compare_price': 69.99,
                        'short_description': 'Modern 3D character illustrations for web and apps.',
                        'description': 'Trendy 3D character illustrations in various poses and scenarios. Perfect for landing pages, apps, and presentations.',
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Characters', 'value': '50+'},
                            {'name': 'Poses', 'value': '150+'},
                            {'name': 'Format', 'value': 'PNG, Figma'},
                        ]
                    },
                    {
                        'name': 'Logo Template Mega Bundle',
                        'brand': None,
                        'price': 44.99,
                        'compare_price': 89.99,
                        'short_description': '300+ editable logo templates for any business.',
                        'description': 'Professional logo templates for various industries. Fully editable in Adobe Illustrator and Canva.',
                        'featured': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Logos', 'value': '300+'},
                            {'name': 'Format', 'value': 'AI, EPS, Canva'},
                            {'name': 'Industries', 'value': '25+'},
                        ]
                    },
                ],
                'software': [
                    {
                        'name': 'TaskMaster Pro - Project Management Software',
                        'brand': None,
                        'price': 79.99,
                        'compare_price': 149.99,
                        'short_description': 'All-in-one project management for teams.',
                        'description': 'Powerful project management software with Kanban boards, Gantt charts, time tracking, and team collaboration. One-time purchase, lifetime license.',
                        'featured': True,
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'License', 'value': 'Lifetime'},
                            {'name': 'Users', 'value': 'Unlimited'},
                            {'name': 'Platforms', 'value': 'Windows, Mac, Web'},
                            {'name': 'Updates', 'value': '1 Year Free'},
                        ]
                    },
                    {
                        'name': 'PhotoEdit Suite - Image Editor',
                        'brand': None,
                        'price': 49.99,
                        'short_description': 'Professional photo editing software.',
                        'description': 'Advanced photo editing with layers, filters, AI-powered tools, and RAW support. Perfect alternative to expensive subscriptions.',
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'License', 'value': 'Lifetime'},
                            {'name': 'Platforms', 'value': 'Windows, Mac'},
                            {'name': 'RAW Support', 'value': 'Yes'},
                        ]
                    },
                    {
                        'name': 'VideoStudio Pro - Video Editor',
                        'brand': None,
                        'price': 89.99,
                        'compare_price': 199.99,
                        'short_description': 'Professional video editing made easy.',
                        'description': 'Complete video editing suite with 4K support, motion graphics, color grading, and audio editing. No subscription required.',
                        'featured': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Resolution', 'value': 'Up to 8K'},
                            {'name': 'Effects', 'value': '1000+'},
                            {'name': 'Platforms', 'value': 'Windows, Mac'},
                        ]
                    },
                ],
                'online-courses': [
                    {
                        'name': 'Complete Python Developer Masterclass',
                        'brand': None,
                        'price': 94.99,
                        'compare_price': 199.99,
                        'short_description': 'From beginner to professional Python developer.',
                        'description': 'Comprehensive Python course covering basics to advanced topics including web development, data science, automation, and machine learning. 50+ hours of content.',
                        'featured': True,
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Duration', 'value': '50+ Hours'},
                            {'name': 'Projects', 'value': '20+'},
                            {'name': 'Certificate', 'value': 'Yes'},
                            {'name': 'Access', 'value': 'Lifetime'},
                        ]
                    },
                    {
                        'name': 'Digital Marketing Complete Course',
                        'brand': None,
                        'price': 79.99,
                        'compare_price': 149.99,
                        'short_description': 'Master all aspects of digital marketing.',
                        'description': 'Learn SEO, Google Ads, Facebook Ads, content marketing, email marketing, and analytics. Includes real-world projects.',
                        'featured': True,
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Duration', 'value': '40+ Hours'},
                            {'name': 'Modules', 'value': '12'},
                            {'name': 'Certificate', 'value': 'Yes'},
                        ]
                    },
                    {
                        'name': 'UI/UX Design Bootcamp',
                        'brand': None,
                        'price': 89.99,
                        'short_description': 'Become a professional UI/UX designer.',
                        'description': 'Complete UI/UX design course covering Figma, user research, wireframing, prototyping, and design systems.',
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Duration', 'value': '35+ Hours'},
                            {'name': 'Tools', 'value': 'Figma, Adobe XD'},
                            {'name': 'Projects', 'value': '10+'},
                        ]
                    },
                ],
                'music-audio': [
                    {
                        'name': 'Cinematic Music Pack - Epic Orchestral',
                        'brand': None,
                        'price': 49.99,
                        'compare_price': 99.99,
                        'short_description': 'Epic orchestral tracks for films and games.',
                        'description': '25 royalty-free cinematic music tracks perfect for trailers, films, games, and YouTube videos.',
                        'featured': True,
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Tracks', 'value': '25'},
                            {'name': 'Format', 'value': 'WAV, MP3'},
                            {'name': 'License', 'value': 'Royalty-Free'},
                        ]
                    },
                    {
                        'name': 'Lo-Fi Hip Hop Beat Collection',
                        'brand': None,
                        'price': 29.99,
                        'short_description': 'Chill beats for studying and relaxation.',
                        'description': '50 lo-fi hip hop beats perfect for YouTube, podcasts, and background music. All tracks are royalty-free.',
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Beats', 'value': '50'},
                            {'name': 'Format', 'value': 'WAV, MP3'},
                            {'name': 'BPM Range', 'value': '70-90'},
                        ]
                    },
                    {
                        'name': 'Podcast Sound Effects Bundle',
                        'brand': None,
                        'price': 24.99,
                        'short_description': 'Professional sound effects for podcasters.',
                        'description': '500+ sound effects including transitions, whooshes, impacts, and ambient sounds.',
                        'featured': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Effects', 'value': '500+'},
                            {'name': 'Format', 'value': 'WAV, MP3'},
                            {'name': 'Categories', 'value': '20+'},
                        ]
                    },
                ],
                'fonts': [
                    {
                        'name': 'Modern Sans Serif Font Family',
                        'brand': None,
                        'price': 29.99,
                        'compare_price': 49.99,
                        'short_description': 'Clean, versatile sans-serif for any project.',
                        'description': 'Complete font family with 12 weights from thin to black, plus italics. Perfect for branding, web, and print.',
                        'featured': True,
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Weights', 'value': '12'},
                            {'name': 'Formats', 'value': 'OTF, TTF, WOFF, WOFF2'},
                            {'name': 'License', 'value': 'Desktop & Web'},
                            {'name': 'Languages', 'value': '100+'},
                        ]
                    },
                    {
                        'name': 'Elegant Script Font Collection',
                        'brand': None,
                        'price': 24.99,
                        'short_description': '5 beautiful script fonts for elegant designs.',
                        'description': 'Collection of 5 elegant script fonts perfect for wedding invitations, branding, and social media.',
                        'featured': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Fonts', 'value': '5'},
                            {'name': 'Glyphs', 'value': '500+ Each'},
                            {'name': 'Formats', 'value': 'OTF, TTF, WOFF'},
                        ]
                    },
                    {
                        'name': 'Display Font Bundle - 20 Fonts',
                        'brand': None,
                        'price': 39.99,
                        'compare_price': 99.99,
                        'short_description': 'Eye-catching display fonts for headlines.',
                        'description': '20 unique display fonts for posters, logos, and social media. Variety of styles from bold to decorative.',
                        'is_bestseller': True,
                        'product_type': 'digital',
                        'specifications': [
                            {'name': 'Fonts', 'value': '20'},
                            {'name': 'Styles', 'value': 'Various'},
                            {'name': 'License', 'value': 'Commercial'},
                        ]
                    },
                ],
            },
        }

        product_count = 0

        # Process each main category
        for main_category_slug, subcategories in products_data.items():
            for subcategory_slug, products in subcategories.items():
                category = self.get_category(subcategory_slug)
                if not category:
                    # Try to get main category if subcategory not found
                    category = self.get_category(main_category_slug)

                if not category:
                    self.stdout.write(self.style.WARNING(f'  Skipping {subcategory_slug} - no category found'))
                    continue

                for product_data in products:
                    try:
                        # Get or create brand
                        brand = self.get_brand(product_data.get('brand'))

                        # Generate SKU
                        sku = f"{subcategory_slug[:3].upper()}-{slugify(product_data['name'])[:20].upper()}-{random.randint(1000, 9999)}"

                        # Create product
                        product, created = Product.objects.update_or_create(
                            slug=slugify(product_data['name']),
                            defaults={
                                'name': product_data['name'],
                                'description': product_data.get('description', product_data['short_description']),
                                'short_description': product_data['short_description'],
                                'price': Decimal(str(product_data['price'])),
                                'compare_price': Decimal(str(product_data['compare_price'])) if product_data.get('compare_price') else None,
                                'sku': sku,
                                'stock': random.randint(10, 100),
                                'category': category,
                                'brand': brand,
                                'product_type': product_data.get('product_type', 'physical'),
                                'weight': Decimal(str(product_data.get('weight', 0.5))),
                                'featured': product_data.get('featured', False),
                                'is_bestseller': product_data.get('is_bestseller', False),
                                'is_new': random.choice([True, False]),
                                'is_available': True,
                            }
                        )

                        # Create specifications
                        if created:
                            ProductSpecification.objects.filter(product=product).delete()
                            for idx, spec in enumerate(product_data.get('specifications', [])):
                                ProductSpecification.objects.create(
                                    product=product,
                                    name=spec['name'],
                                    value=spec['value'],
                                    order=idx
                                )

                        action = 'Created' if created else 'Updated'
                        self.stdout.write(f"  {action}: {product.name}")
                        product_count += 1

                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"  Error creating {product_data['name']}: {str(e)}"))

        self.stdout.write(self.style.SUCCESS(f'\n  Total products seeded: {product_count}'))