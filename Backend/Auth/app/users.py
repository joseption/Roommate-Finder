import email
import uuid
from typing import Optional
from app.config import secret
import app.email.email as sendgrid

from fastapi import Depends, Request
from fastapi_users import BaseUserManager, FastAPIUsers, UUIDIDMixin
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
    CookieTransport,
)
from fastapi_users.db import SQLAlchemyUserDatabase
from app.db import User, get_user_db

SECRET = secret


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        sendgrid.resetPassword(token, user.email)


    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        sendgrid.VerifyEmail(token, user.email)

async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)


#bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")
#remove not secure cookie on depolyment
cookie_transport = CookieTransport(cookie_name="__Token", cookie_max_age=3600,cookie_samesite="none")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)
