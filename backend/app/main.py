from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import Base, engine, init_db
from app.api.ingest import router as ingest_router
from app.api.catalog import router as catalog_router
from app.api.match import router as match_router
from app.api.explain import router as explain_router

app = FastAPI(title="MOSaic POC", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    init_db()

app.include_router(ingest_router, prefix="/ingest", tags=["ingest"])
app.include_router(catalog_router, prefix="/catalog", tags=["catalog"])
app.include_router(match_router, prefix="/match", tags=["match"])
app.include_router(explain_router, prefix="/ai", tags=["ai"])
