from fastapi import APIRouter, HTTPException, Request
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
from pydantic import BaseModel, EmailStr
from typing import Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.db import insert_lead, list_leads

router = APIRouter()

_chat_client = None


def get_chat_client() -> ChatCompletionsClient:
    global _chat_client
    if _chat_client is None:
        endpoint = settings.azure_openai_endpoint.rstrip("/")
        deployment = settings.azure_openai_chat_deployment
        _chat_client = ChatCompletionsClient(
            endpoint=f"{endpoint}/openai/deployments/{deployment}",
            credential=AzureKeyCredential(settings.azure_openai_key),
        )
    return _chat_client


class ContactRequest(BaseModel):
    name: str
    email: str
    profession: Optional[str] = None
    message: str


@router.post("/contact")
async def contact(body: ContactRequest):
    if not settings.smtp_app_password:
        raise HTTPException(status_code=503, detail="Mail service not configured.")
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[AI Workloads] Message from {body.name}"
        msg["From"] = settings.smtp_email
        msg["To"] = settings.smtp_email
        msg["Reply-To"] = body.email

        html = f"""
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f0f0f;color:#e5e5e5;border-radius:12px">
          <h2 style="color:#818cf8;margin-top:0">New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr><td style="color:#9ca3af;padding:6px 0;width:110px">Name</td><td style="color:#fff">{body.name}</td></tr>
            <tr><td style="color:#9ca3af;padding:6px 0">Email</td><td style="color:#fff">{body.email}</td></tr>
            {"<tr><td style='color:#9ca3af;padding:6px 0'>Profession</td><td style='color:#fff'>" + body.profession + "</td></tr>" if body.profession else ""}
          </table>
          <div style="background:#1f1f1f;border-left:3px solid #818cf8;padding:16px;border-radius:6px">
            <p style="color:#9ca3af;margin:0 0 8px 0;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Message</p>
            <p style="margin:0;line-height:1.7">{body.message}</p>
          </div>
          <p style="color:#4b5563;font-size:12px;margin-top:20px">Sent from AI Workloads Demo contact form</p>
        </div>
        """
        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(settings.smtp_email, settings.smtp_app_password)
            server.sendmail(settings.smtp_email, settings.smtp_email, msg.as_string())

        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")


@router.get("/did-you-know")
async def did_you_know():
    try:
        client = get_chat_client()
        response = client.complete(
            messages=[
                SystemMessage(content=(
                    "You are a concise science communicator. "
                    "Share one surprising, specific fact about AI or computer science. "
                    "Keep it between 30 and 50 words. No intro phrases like 'Did you know'. "
                    "Just the fact, written in plain English."
                )),
                UserMessage(content="Give me a new interesting fact."),
            ],
            max_tokens=80,
            temperature=1.0,
        )
        fact = response.choices[0].message.content.strip()
        return {"fact": fact, "model": settings.azure_openai_chat_deployment}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate fact: {str(e)}")


class GuestSignupRequest(BaseModel):
    name: str
    email: EmailStr


@router.post("/guest-signup")
async def guest_signup(body: GuestSignupRequest, request: Request):
    ip = request.client.host if request.client else None
    inserted = insert_lead(body.name.strip(), body.email.lower(), ip)
    return {"success": True, "new": inserted}


@router.get("/guest-leads")
async def guest_leads():
    """Returns all collected guest leads (name, email, ip, timestamp)."""
    return {"leads": list_leads()}
