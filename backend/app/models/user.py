import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    String, Integer, Boolean, DateTime, ForeignKey,
    Enum, JSON, Text, Numeric, SmallInteger,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from app.core.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class UserRole(str, enum.Enum):
    guest = "guest"
    user = "user"
    premium = "premium"
    admin = "admin"


class UserPlan(str, enum.Enum):
    free = "free"
    pro = "pro"
    enterprise = "enterprise"


# ---------------------------------------------------------------------------
# Table 1 — users  (core identity + login)
# ---------------------------------------------------------------------------

class User(Base):
    __tablename__ = "users"

    # Primary key — UUID string (non-sequential, safe to expose in APIs)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid, index=True)

    # Identity
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    picture: Mapped[str | None] = mapped_column(String(512), nullable=True)

    # Local auth — NULL for OAuth-only users
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    email_verify_token: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email_verify_expiry: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Social login — NULL if unused
    google_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    microsoft_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    github_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)

    # Password reset
    reset_token_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    reset_token_expiry: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Account state
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.user, nullable=False)
    plan: Mapped[UserPlan] = mapped_column(Enum(UserPlan), default=UserPlan.free, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_banned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    ban_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Metadata
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    last_login_ip: Mapped[str | None] = mapped_column(String(45), nullable=True)
    login_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    auth_tokens: Mapped[list["AuthToken"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    profile: Mapped["UserProfile | None"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    quota: Mapped["UserQuota | None"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    usage_logs: Mapped[list["ResourceUsage"]] = relationship(back_populates="user")


# ---------------------------------------------------------------------------
# Table 2 — auth_tokens  (refresh token store + session management)
# ---------------------------------------------------------------------------

class AuthToken(Base):
    __tablename__ = "auth_tokens"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid, index=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)

    # Store SHA-256 hash only — never the raw token
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    # Family groups all rotated tokens from one login — lets us detect token-reuse attacks
    token_family: Mapped[str] = mapped_column(String(36), default=_uuid, nullable=False, index=True)

    # Lifecycle
    issued_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Revocation
    revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    revoke_reason: Mapped[str | None] = mapped_column(String(100), nullable=True)
    # Possible values: 'logout', 'password_change', 'admin_revoke', 'rotation', 'expired'

    # Device context (for "active sessions" UI)
    device_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    country_code: Mapped[str | None] = mapped_column(String(2), nullable=True)

    user: Mapped["User"] = relationship(back_populates="auth_tokens")


# Backward-compat alias — existing auth.py code imports RefreshToken
RefreshToken = AuthToken


# ---------------------------------------------------------------------------
# Table 3 — user_profiles  (geography, demographics, device)
# ---------------------------------------------------------------------------

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), unique=True, nullable=False, index=True
    )

    # Personal details (user-provided)
    first_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    occupation: Mapped[str | None] = mapped_column(String(150), nullable=True)
    organization: Mapped[str | None] = mapped_column(String(200), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Location (user-provided or GeoIP-derived)
    country_code: Mapped[str | None] = mapped_column(String(2), nullable=True)
    country_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    region: Mapped[str | None] = mapped_column(String(100), nullable=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    timezone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    locale: Mapped[str | None] = mapped_column(String(10), nullable=True)
    language: Mapped[str | None] = mapped_column(String(10), nullable=True)

    # GeoIP (auto-updated from IP on each login — NOT user-provided)
    geoip_country_code: Mapped[str | None] = mapped_column(String(2), nullable=True)
    geoip_region: Mapped[str | None] = mapped_column(String(100), nullable=True)
    geoip_city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    geoip_latitude: Mapped[float | None] = mapped_column(Numeric(9, 6), nullable=True)
    geoip_longitude: Mapped[float | None] = mapped_column(Numeric(9, 6), nullable=True)
    geoip_isp: Mapped[str | None] = mapped_column(String(200), nullable=True)
    geoip_last_updated: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Device & browser (captured from User-Agent on login)
    primary_device: Mapped[str | None] = mapped_column(String(50), nullable=True)
    primary_os: Mapped[str | None] = mapped_column(String(50), nullable=True)
    primary_browser: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # Engagement
    # JSON list e.g. ["vision", "nlp"] — derived from resource_usage
    preferred_workloads: Mapped[list | None] = mapped_column(JSON, nullable=True)
    onboarding_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    newsletter_subscribed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    referral_source: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped["User"] = relationship(back_populates="profile")


# ---------------------------------------------------------------------------
# Table 4 — resource_usage  (every Azure/AI API call logged here)
# ---------------------------------------------------------------------------

class ResourceUsage(Base):
    __tablename__ = "resource_usage"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    # SET NULL on user deletion — retain the log even after account is deleted
    user_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # Request context
    session_id: Mapped[str | None] = mapped_column(String(36), nullable=True)  # auth_tokens.id
    request_id: Mapped[str] = mapped_column(String(36), default=_uuid, nullable=False)

    # What was called
    workload_category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    # e.g. 'nlp', 'vision', 'speech', 'document', 'search', 'train', 'basics_cv', 'misc'
    demo_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    # e.g. 'sentiment_analysis', 'object_detection', 'whisper_stt', 'ocr'
    endpoint: Mapped[str] = mapped_column(String(200), nullable=False)
    http_method: Mapped[str] = mapped_column(String(10), default="POST", nullable=False)

    # AI service used
    ai_provider: Mapped[str | None] = mapped_column(String(50), nullable=True)
    # e.g. 'azure_openai', 'azure_vision', 'azure_speech', 'huggingface', 'whisper_local'
    model_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    ai_region: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # Performance
    started_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    duration_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Token / compute usage (LLM calls)
    input_tokens: Mapped[int | None] = mapped_column(Integer, nullable=True)
    output_tokens: Mapped[int | None] = mapped_column(Integer, nullable=True)
    total_tokens: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # File usage (vision / speech uploads)
    input_file_size_kb: Mapped[int | None] = mapped_column(Integer, nullable=True)
    input_file_type: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # Outcome
    status: Mapped[str] = mapped_column(String(20), default="success", nullable=False, index=True)
    # e.g. 'success', 'error', 'timeout', 'quota_exceeded'
    http_status_code: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    error_code: Mapped[str | None] = mapped_column(String(100), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Cost tracking (calculated post-call based on provider pricing)
    estimated_cost_usd: Mapped[float | None] = mapped_column(Numeric(10, 8), nullable=True)

    # Client context at time of request
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    country_code: Mapped[str | None] = mapped_column(String(2), nullable=True)

    # Input metadata snapshot for debugging — do NOT store full user input (privacy)
    # Example: {"text_length": 245, "language": "en"}
    # Example: {"image_width": 640, "image_height": 480, "format": "jpeg"}
    input_summary: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    user: Mapped["User | None"] = relationship(back_populates="usage_logs")


# ---------------------------------------------------------------------------
# Table 5 — user_quotas  (per-user rate limits and plan counters)
# ---------------------------------------------------------------------------

_DEFAULT_WORKLOAD_LIMITS = {
    "nlp": 20,
    "vision": 15,
    "speech": 10,
    "document": 10,
    "search": 50,
    "train": 3,
    "basics_cv": 20,
    "misc": 10,
}


class UserQuota(Base):
    __tablename__ = "user_quotas"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), unique=True, nullable=False, index=True
    )

    # Plan tier (mirrors User.plan — kept here for fast quota lookups without joining users)
    plan: Mapped[str] = mapped_column(String(50), default="free", nullable=False)

    # Hard limits per plan
    daily_call_limit: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    monthly_call_limit: Mapped[int] = mapped_column(Integer, default=500, nullable=False)
    max_file_size_mb: Mapped[float] = mapped_column(Numeric(6, 2), default=5.0, nullable=False)

    # Current-period counters (reset by a scheduled job or on first call after reset_at)
    daily_calls_used: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    monthly_calls_used: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    daily_reset_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    monthly_reset_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Per-workload daily limits (JSON dict — flexible, no schema migration needed to add workloads)
    workload_limits: Mapped[dict] = mapped_column(
        JSON, default=lambda: dict(_DEFAULT_WORKLOAD_LIMITS), nullable=False
    )

    # Lifetime totals — never reset
    total_calls_lifetime: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_cost_lifetime_usd: Mapped[float] = mapped_column(Numeric(12, 6), default=0, nullable=False)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped["User"] = relationship(back_populates="quota")
