import json
from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

VALID_PAYLOAD = {"messages": [{"role": "user", "content": "Hello"}]}


def _mock_openai_response(content: str):
    """Build a minimal mock that looks like an OpenAI chat completion."""
    mock_response = MagicMock()
    mock_response.choices[0].message.content = content
    return mock_response


def test_chat_returns_reply_and_fields(monkeypatch):
    body = json.dumps({"reply": "Hi! What is the purpose of the NDA?", "fields": {"effectiveDate": "2026-03-22"}})

    with patch("chat.OpenAI") as mock_cls:
        mock_cls.return_value.chat.completions.create.return_value = _mock_openai_response(body)
        monkeypatch.setenv("OPENAI_API_KEY", "test-key")

        response = client.post("/chat", json=VALID_PAYLOAD)

    assert response.status_code == 200
    data = response.json()
    assert data["reply"] == "Hi! What is the purpose of the NDA?"
    assert data["fields"]["effectiveDate"] == "2026-03-22"


def test_chat_missing_api_key(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    response = client.post("/chat", json=VALID_PAYLOAD)

    assert response.status_code == 500
    assert "OPENAI_API_KEY" in response.json()["detail"]


def test_chat_handles_invalid_json_from_model(monkeypatch):
    with patch("chat.OpenAI") as mock_cls:
        mock_cls.return_value.chat.completions.create.return_value = _mock_openai_response("not valid json at all")
        monkeypatch.setenv("OPENAI_API_KEY", "test-key")

        response = client.post("/chat", json=VALID_PAYLOAD)

    assert response.status_code == 200
    data = response.json()
    assert data["reply"] == "not valid json at all"
    assert data["fields"] == {}


def test_chat_empty_fields_when_none_extracted(monkeypatch):
    body = json.dumps({"reply": "Got it.", "fields": {}})

    with patch("chat.OpenAI") as mock_cls:
        mock_cls.return_value.chat.completions.create.return_value = _mock_openai_response(body)
        monkeypatch.setenv("OPENAI_API_KEY", "test-key")

        response = client.post("/chat", json=VALID_PAYLOAD)

    assert response.status_code == 200
    assert response.json()["fields"] == {}
