from rest_framework import views, permissions, response, status

from config.permissions import IsClientOnly
from billing.models import UserBillingModel
from billing.serializers import UserBillingSerializer

class UserBillingViewSet(views.APIView):
    permission_classes = [IsClientOnly]

    def get(self, request, format=None):
        try:
            cur_billing = UserBillingModel.objects.filter(user=request.user).first()
            if cur_billing:
                serializer = UserBillingSerializer(cur_billing)
                return response.Response(status=status.HTTP_200_OK, data=serializer.data)
            else:
                return response.Response(status=status.HTTP_200_OK, data={})
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": f"{str(e)}"})
        
    def post(self, request, format=None):
        try:
            cur_billing = UserBillingModel.objects.filter(user=request.user).first()
            if cur_billing:
                serializer = UserBillingSerializer(cur_billing, data=request.data, partial=True)
            else:
                serializer = UserBillingSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return response.Response(status=status.HTTP_200_OK, data=serializer.data)
            else:
                return response.Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)
        except Exception as e:
            return response.Response(status=status.HTTP_400_BAD_REQUEST, data={"message": f"{str(e)}"})

