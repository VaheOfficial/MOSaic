import os
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL", "sqlite:///./mosaic.db")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change")
JWT_ALG = os.getenv("JWT_ALG", "HS256")
