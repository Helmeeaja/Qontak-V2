from rest_framework.response import Response
from rest_framework.views import APIView

from qontak_sales.apps.accounts.permissions import IsManagerOrReadOnly


class SingletonSettingView(APIView):

    permission_classes = [IsManagerOrReadOnly]
    model = None
    serializer_class = None

    def get(self, request):
        serializer = self.serializer_class(self.model.load(), context={"request": request})
        return Response(serializer.data)

    def put(self, request):
        serializer = self.serializer_class(
            self.model.load(), data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
