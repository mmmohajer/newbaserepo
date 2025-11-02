from billing.models import ProductModel

MENTORSHIP_PRODUCTS = [
    {
    "title": "1 Session",
    "description": "Perfect for quick guidance or specific technical challenges.",
    "pricePerHour": 0,
    "totalPrice": 149.99,
    "buttonText": "Book Now",
    "offPercentage": 0,
    "highlight": False,
    "isPopular": False,
    "order": 1,
  },
  {
    "title": "5 Hours",
    "description": "Ideal for project-based learning or ongoing support.",
    "pricePerHour": 124.99,
    "totalPrice": 124.99 * 5,
    "buttonText": "Get Started",
    "offPercentage": 17,
    "highlight": True,
    "isPopular": True,
    "order": 2,
  },
  {
    "title": "10 Hours",
    "description": "Best value for long-term mentorship and deep skill growth.",
    "pricePerHour": 99.99,
    "totalPrice": 99.99 * 10,
    "buttonText": "Enroll Now",
    "offPercentage": 33,
    "highlight": False,
    "isPopular": False,
    "order": 3,
  },
]

def add_mentorship_products_to_db():
    for product_data in MENTORSHIP_PRODUCTS:
        product, created = ProductModel.objects.update_or_create(
            name=product_data["title"],
            category='personalized_mentorship',
            defaults={
                'description': product_data["description"],
                'price': product_data["totalPrice"],
                'currency': 'usd',
                'order': product_data["order"],
                'details': {
                    'pricePerHour': product_data["pricePerHour"],
                    'buttonText': product_data["buttonText"],
                    'offPercentage': product_data["offPercentage"],
                    'highlight': product_data["highlight"],
                    'isPopular': product_data["isPopular"],
                }
            }
        )
        if created:
            print(f"Created product: {product.name}")
        else:
            print(f"Updated Product: {product.name}")