from pdfminer.high_level import extract_text
from io import BytesIO

def extract_pdf_text(pdf_content):
    """
    Extract text from PDF content (bytes or file-like object).

    :param pdf_content: PDF content as bytes or file-like object.
    :return: The extracted text as a string.
    """
    try:
        # If pdf_content is bytes, convert to BytesIO
        if isinstance(pdf_content, bytes):
            pdf_file = BytesIO(pdf_content)
        else:
            pdf_file = pdf_content
            
        text = extract_text(pdf_file)
        return text
    except Exception as e:
        # Handle exceptions during PDF processing
        print(f"Error extracting PDF: {e}")
        return ""
