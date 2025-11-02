from rest_framework import views, permissions, response, status

from config.permissions import IsClientOnly
from billing.models import ProductModel
from billing.serializers import ProductSerializer

class MentorshipProductViewSet(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        try:
            products = ProductModel.objects.filter(category='personalized_mentorship').order_by("order")
            serializer = ProductSerializer(products, many=True)
            return response.Response(status=status.HTTP_200_OK, data=serializer.data)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": f"{str(e)}"})

