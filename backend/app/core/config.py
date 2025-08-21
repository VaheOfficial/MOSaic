import os
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL", "sqlite:///./mosaic.db")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
