from rest_framework.mixins import (
    CreateModelMixin,
    UpdateModelMixin,
    RetrieveModelMixin,
    DestroyModelMixin,
    ListModelMixin,
)
from core.response import Response


class WrappedResponseMixin(
    CreateModelMixin,
    UpdateModelMixin,
    RetrieveModelMixin,
    DestroyModelMixin,
    ListModelMixin,
):
    def is_success_status_code(self, status_code):
        return status_code >= 200 and status_code < 300

    def finalize_response(self, request, response, *args, **kwargs):
        if self.is_success_status_code(response.status_code):
            wrappend_response = Response.success(
                data=response.data, status=response.status_code
            )
        else:
            wrappend_response = Response.error(
                error=response.data, status=response.status_code
            )
        return super().finalize_response(request, wrappend_response, *args, **kwargs)