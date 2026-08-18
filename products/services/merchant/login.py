from django.contrib.auth import authenticate
from products.models import Merchants
from dataclasses import dataclass

from django.contrib.auth import authenticate
from products.models import Merchants


from dataclasses import dataclass

@dataclass
class MerchantLoginResult:
    success: bool
    error: str = None
    user: object = None



def validate_merchant_login(email, password):
    """
    منطق تسجيل دخول التاجر
    ❌ لا request
    ❌ لا session
    ❌ لا JWT
    """

    try:
        merchant = Merchants.objects.select_related("user").get(email=email)
    except Merchants.DoesNotExist:
        return MerchantLoginResult(
            success=False,
            error="error_invalid_credentials"
        )

    if not merchant.is_verified:
        return MerchantLoginResult(
            success=False,
            error="account_not_verified"
        )

    if merchant.user is None:
        return MerchantLoginResult(
            success=False,
            error="account_not_linked"
        )

    user = authenticate(
        username=merchant.user.username,
        password=password
    )

    if user is None:
        return MerchantLoginResult(
            success=False,
            error="error_invalid_credentials"
        )

    return MerchantLoginResult(
        success=True,
        user=user
    )
