import pdfplumber
import io
from fastapi import UploadFile


async def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Read an uploaded PDF and return all extracted text as a single string.
    Returns empty string if extraction fails.
    """
    try:
        content = await file.read()
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            pages_text = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text.strip())
        
        full_text = "\n\n".join(pages_text)
        
        # Truncate to ~3000 chars to keep prompt size reasonable
        if len(full_text) > 3000:
            full_text = full_text[:3000] + "...[truncated]"
        
        return full_text
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""
