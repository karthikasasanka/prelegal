import json
import os

from fastapi import APIRouter, HTTPException
from openai import OpenAI
from pydantic import BaseModel

router = APIRouter()

SYSTEM_PROMPT = """You are a legal document assistant helping users fill out a Mutual Non-Disclosure Agreement (MNDA).

Your goal is to gather the following information through natural, friendly conversation:
- purpose: How Confidential Information may be used (e.g. "Evaluating a potential business partnership")
- effectiveDate: The effective date in YYYY-MM-DD format
- mndaTermType: "expires" if the MNDA expires after N years, "continues" if it continues until terminated
- mndaTermDuration: If mndaTermType is "expires", number of years as a string (e.g. "2")
- confidentialityType: "duration" if confidentiality lasts N years, "perpetuity" if it lasts forever
- confidentialityDuration: If confidentialityType is "duration", number of years as a string (e.g. "3")
- governingLaw: The governing law (e.g. "Delaware")
- jurisdiction: The specific jurisdiction (e.g. "New Castle, DE")
- modifications: Any modifications to the standard terms, or empty string for none
- party1Name, party1Title, party1Company, party1Address, party1Date: Party 1 signatory details
- party2Name, party2Title, party2Company, party2Address, party2Date: Party 2 signatory details

Guidelines:
- Start by greeting the user and asking about the purpose of the NDA
- Ask 1-2 questions at a time — keep the conversation flowing naturally
- Use the context of prior answers to ask follow-up questions intelligently
- Dates should be in YYYY-MM-DD format; if the user says "today" use today's date
- When all fields are collected, summarize and confirm with the user

IMPORTANT: Always respond with ONLY valid JSON in this exact format:
{
  "reply": "Your conversational message to the user",
  "fields": {
    "purpose": "...",
    "effectiveDate": "..."
  }
}

Only include fields in "fields" that you have determined values for. Omit unknown fields entirely.
Do not include any text outside the JSON object."""


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]


class ChatResponse(BaseModel):
    reply: str
    fields: dict


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")

    client = OpenAI(api_key=api_key)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + [
        {"role": m.role, "content": m.content} for m in request.messages
    ]

    response = client.chat.completions.create(
        model="gpt-5.4",
        max_tokens=1024,
        response_format={"type": "json_object"},
        messages=messages,
    )

    raw = response.choices[0].message.content.strip()

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        parsed = {"reply": raw, "fields": {}}

    return ChatResponse(reply=parsed.get("reply", ""), fields=parsed.get("fields", {}))
