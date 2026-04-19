import uuid
from datetime import datetime, timezone

from azure.core.exceptions import ResourceExistsError
from azure.data.tables import TableServiceClient

from app.core.config import settings

TABLE_NAME = "GuestLeads"


def _service():
    return TableServiceClient.from_connection_string(settings.azure_storage_connection_string)


def _table():
    return _service().get_table_client(TABLE_NAME)


def init_db():
    if not settings.azure_storage_connection_string:
        return
    try:
        _service().create_table(TABLE_NAME)
    except ResourceExistsError:
        pass


def insert_lead(name: str, email: str, ip: str | None = None) -> bool:
    """Returns True if inserted, False if email already registered."""
    if not settings.azure_storage_connection_string:
        return False
    entity = {
        "PartitionKey": "leads",
        "RowKey": email,          # email is the unique row key → automatic dedup
        "name": name,
        "ip": ip or "",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    try:
        _table().create_entity(entity)
        return True
    except ResourceExistsError:
        return False


def list_leads() -> list[dict]:
    if not settings.azure_storage_connection_string:
        return []
    rows = _table().query_entities("PartitionKey eq 'leads'")
    leads = [
        {
            "name": e.get("name", ""),
            "email": e["RowKey"],
            "ip": e.get("ip", ""),
            "created_at": e.get("created_at", ""),
        }
        for e in rows
    ]
    return sorted(leads, key=lambda x: x["created_at"], reverse=True)
