from rest_framework.response import Response as DRFResponse
from typing import Any

SendableJson = dict | Any | None


class Response:
    @staticmethod
    def get_response_dict(
        data: dict, status: int, message: str, error: SendableJson = None
    ):
        return {"data": data, "status": status, "message": message, "error": error}

    @staticmethod
    def success(
        data: SendableJson = None,
        status: int = 200,
        template_name: Any | None = None,
        headers: Any | None = None,
        exception: bool = False,
        content_type: Any | None = None,
    ):
        return DRFResponse(
            data=Response.get_response_dict(
                data=data, status=status, message="success"
            ),
            status=status,
            template_name=template_name,
            headers=headers,
            exception=exception,
            content_type=content_type,
        )

    @staticmethod
    def error(
        data: SendableJson = None,
        status: int = 400,
        template_name: Any | None = None,
        headers: Any | None = None,
        exception: bool = False,
        content_type: Any | None = None,
        error: SendableJson = None,
    ):
        return DRFResponse(
            data=Response.get_response_dict(
                data=data, status=status, message="error", error=error
            ),
            status=status,
            template_name=template_name,
            headers=headers,
            exception=exception,
            content_type=content_type,
        )
