import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from clerk_backend_api import Clerk, AuthenticateRequestOptions
from loguru import logger
from starlette.responses import JSONResponse

from router import router

load_dotenv()

app = FastAPI(title="AI Operations API")

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://xpertdiagram.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.middleware("http")
async def authenticate_request(request, call_next):
    """Authentication middleware using Clerk"""
    try:
        clerk_client = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

        # Skip auth for OPTIONS requests
        if request.method != "OPTIONS" and request.url.path not in ["/health", "/"]:
            request_state = clerk_client.authenticate_request(
                request,
                AuthenticateRequestOptions(secret_key=os.getenv("CLERK_SECRET_KEY"))
            )
            if not request_state.is_signed_in:
                raise HTTPException(status_code=401, detail="Unauthorized")

        response = await call_next(request)
        return response

    except Exception as e:
        logger.error(f"Authentication error: {e}")
        return JSONResponse({"error": "Unauthorized"}, status_code=401)



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

