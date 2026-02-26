"""
AI service — powered by OpenRouter (OpenAI-compatible endpoint).
Falls back gracefully if the API key is missing.
"""
import os
import json
import re
import asyncio
import pathlib
from typing import List, Dict, Any
from dotenv import load_dotenv
from openai import OpenAI

# Load .env from backend root regardless of CWD
_ENV_PATH = pathlib.Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH, override=True)

# OpenRouter config
OPENROUTER_BASE = "https://openrouter.ai/api/v1"
MODEL = "stepfun/step-3.5-flash:free"   # confirmed working free model on OpenRouter


def _get_client() -> OpenAI:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY is not set in .env")
    return OpenAI(
        api_key=api_key,
        base_url=OPENROUTER_BASE,
        default_headers={
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "InterviewIQ",
        },
    )


def _build_system_prompt(
    role: str,
    level: str,
    current_round: str,
    resume_text: str,
    job_description: str,
    question_count: int,
) -> str:
    return f"""You are a professional technical interviewer at a top tech company conducting a real job interview.

=== CANDIDATE INFO ===
Target Role: {role}
Experience Level: {level}
Current Round: {current_round}
Questions Asked So Far: {question_count}

=== RESUME SUMMARY ===
{resume_text or "No resume provided — use general knowledge for this role."}

=== JOB DESCRIPTION ===
{job_description or "No JD provided — focus on core skills for the role."}

=== YOUR BEHAVIOR RULES ===
1. Ask ONE focused question at a time. Never bundle multiple questions.
2. After EVERY answer, internally evaluate it before responding:
   - Technical depth: Did they explain HOW, not just WHAT?
   - Concrete examples: Did they reference real projects/experience?
   - Clarity & structure: Was it organized?
3. WEAK answer (score < 5): Ask a probing follow-up for detail.
4. STRONG answer (score >= 7): Escalate difficulty — go deeper or move to the next topic.
5. Keep the interview realistic. Don't be overly encouraging. Challenge the candidate.
6. After exactly 6 questions, wrap up the interview naturally.

=== RESPONSE FORMAT (STRICT JSON ONLY) ===
Respond with ONLY valid JSON. No markdown, no text outside JSON.
{{
  "reply": "Your next question or follow-up as the interviewer...",
  "score": 7,
  "feedback": "One sentence evaluating the candidate's LAST answer.",
  "weak_points": ["gap1", "gap2"],
  "is_follow_up": false,
  "interview_complete": false
}}

If question_count is 0 (first message), welcome the candidate briefly and ask your first question. Set score and feedback to null.
"""


def _conversation_to_messages(history: List[Dict], system: str) -> List[Dict]:
    """Convert stored history to OpenAI message format."""
    msgs = [{"role": "system", "content": system}]
    for msg in history:
        role = "assistant" if msg["role"] == "ai" else "user"
        msgs.append({"role": role, "content": msg["content"]})
    return msgs


def _parse_response(raw: str) -> Dict[str, Any]:
    """Safely parse JSON response by extracting the JSON block."""
    try:
        # Find the first { and last } to extract pure JSON
        start = raw.find('{')
        end = raw.rfind('}')
        if start != -1 and end != -1 and end >= start:
            clean = raw[start:end+1]
            return json.loads(clean)
        # Fallback if no braces found
        clean = re.sub(r"```(?:json)?", "", raw).strip().strip("`")
        return json.loads(clean)
    except Exception as e:
        print(f"JSON Parse Error: {e} -> Raw: {raw[:200]}")
        return {
            "reply": raw.strip(),
            "score": None,
            "feedback": None,
            "weak_points": [],
            "is_follow_up": False,
            "interview_complete": False,
        }


async def get_next_interview_turn(
    role: str,
    level: str,
    current_round: str,
    resume_text: str,
    job_description: str,
    history: List[Dict],
    question_count: int,
) -> Dict[str, Any]:
    system = _build_system_prompt(role, level, current_round, resume_text, job_description, question_count)
    messages = _conversation_to_messages(history, system)

    def _call():
        client = _get_client()
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=600,
        )
        return response.choices[0].message.content

    raw = await asyncio.to_thread(_call)
    return _parse_response(raw)


async def generate_feedback_report(
    role: str,
    level: str,
    rounds: List[str],
    transcript: List[Dict],
) -> Dict[str, Any]:
    transcript_text = "\n".join([
        f"[{msg['role'].upper()}] {msg['content']}"
        + (f" (Score: {msg.get('score')}/10)" if msg.get("score") else "")
        for msg in transcript
    ])

    prompt = f"""Analyze this completed mock interview for a {level} {role}. Rounds: {', '.join(rounds)}.

TRANSCRIPT:
{transcript_text}

Return ONLY valid JSON:
{{
  "overall_score": 75,
  "category_scores": {{
    "Technical Depth": 80,
    "Communication": 70,
    "Problem Solving": 65,
    "Behavioral Fit": 85
  }},
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area 1", "area 2", "area 3"],
  "summary": "2-3 sentence overall assessment.",
  "recommendation": "Strong Hire | Hire | Borderline | No Hire"
}}"""

    def _call_feedback():
        client = _get_client()
        response = client.chat.completions.create(
            model="google/gemma-2-9b-it:free", # Robust for large JSON
            messages=[
                {"role": "system", "content": "You are an expert. Output ONLY raw JSON. No markdown ticks, no backticks, no comments, no extra text."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.1,
            max_tokens=1500,
        )
        return response.choices[0].message.content

    raw = await asyncio.to_thread(_call_feedback)
    return _parse_response(raw)
