import os
import aiosqlite

DB_PATH = "data/prelegal.db"


async def init_db():
    os.makedirs("data", exist_ok=True)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.commit()


async def get_db():
    async with aiosqlite.connect(DB_PATH) as db:
        yield db
