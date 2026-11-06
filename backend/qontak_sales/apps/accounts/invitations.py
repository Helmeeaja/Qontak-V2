import hashlib
import logging
import secrets
from datetime import timedelta
from urllib.parse import quote

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from .models import Invitation

logger = logging.getLogger(__name__)


def hash_token(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def issue_invitation(user, created_by=None):
    token = secrets.token_urlsafe(32)
    ttl_days = getattr(settings, "INVITATION_TTL_DAYS", 7)
    invitation, _created = Invitation.objects.update_or_create(
        user=user,
        defaults={
            "token_hash": hash_token(token),
            "expires_at": timezone.now() + timedelta(days=ttl_days),
            "accepted_at": None,
            "created_by": created_by,
        },
    )
    return invitation, token


def find_invitation(token):
    if not token:
        return None
    try:
        return Invitation.objects.select_related("user", "user__company").get(
            token_hash=hash_token(token)
        )
    except Invitation.DoesNotExist:
        return None


def build_invitation_url(token):
    base = getattr(settings, "FRONTEND_URL", "http://localhost:5173").rstrip("/")
    return f"{base}/accept-invitation?token={quote(token)}"


def send_invitation_email(user, invitation_url):
    company_name = user.company.name if user.company else "QontakSales"
    display_name = user.get_full_name().strip() or user.username
    subject = f"Undangan bergabung ke {company_name}"
    message = (
        f"Halo {display_name},\n\n"
        f"Kamu diundang bergabung ke {company_name} di QontakSales.\n"
        "Buka link berikut untuk membuat password akunmu:\n\n"
        f"{invitation_url}\n\n"
        "Link ini hanya bisa dipakai sekali dan akan kedaluwarsa.\n"
        "Kalau kamu tidak merasa diundang, abaikan email ini.\n"
    )
    try:
        send_mail(subject, message, None, [user.email], fail_silently=False)
        return True
    except Exception:
        logger.exception("Gagal mengirim email undangan ke %s", user.email)
        return False
