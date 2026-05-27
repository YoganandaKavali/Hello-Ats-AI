# Render environment variables

Set these in **Render Dashboard → Hello-Ats-AI → Environment**:

| Key | Value |
|-----|--------|
| `DJANGO_SECRET_KEY` | Long random string (see below) |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `hello-ats-ai.onrender.com` |
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `GEMINI_MODEL` | `gemini-2.5-flash` |
| `CORS_ALLOWED_ORIGINS` | `https://hello-ats-ai.vercel.app` |

You can **remove** `SECRET_KEY` after adding `DJANGO_SECRET_KEY` (both work, but use one name).

## Generate a secret key

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Paste the output as `DJANGO_SECRET_KEY` on Render.

## After saving

Click **Save Changes** → **Manual Deploy**.
