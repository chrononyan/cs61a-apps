import os
from contextlib import contextmanager
from os import getenv

import sqlalchemy.engine.url


use_devdb = getenv("ENV", "DEV") in ("DEV", "TEST")
use_prod_proxy = getenv("ENV") == "DEV_ON_PROD"

if use_devdb:
    database_url = "sqlite:///" + os.path.join(
        os.path.abspath(os.path.dirname(__file__)), "../app.db"
    )
elif use_prod_proxy:
    curr = os.path.abspath(os.path.curdir)
    prev = None
    while True:
        if ".git" in os.listdir(curr):
            app = os.path.basename(prev)
            break
        prev = curr
        curr = os.path.dirname(curr)
    assert (
        input(
            "Are you sure? You are about to use the PROD database on a DEV build (y/N) "
        )
        .strip()
        .lower()
        == "y"
    )
    if "cloud_sql_proxy" not in os.listdir(curr):
        print(
            "Follow the instructions at https://cloud.google.com/sql/docs/mysql/sql-proxy to install the proxy "
            "in the root directory of the repository, then try again."
        )
        exit(0)
    database_url = sqlalchemy.engine.url.URL(
        drivername="mysql+pymysql",
        username="root",
        password="oh8jez0NI6f4Ckrr",  # get_secret(secret_name="ROOT_DATABASE_PW"),
        host="127.0.0.1",
        port=3307,
        database=app,
    ).__to_string__(hide_password=False)
else:
    database_url = getenv("DATABASE_URL")

engine = sqlalchemy.create_engine(
    database_url,
    **(
        {}
        if use_devdb
        else dict(pool_size=5, max_overflow=2, pool_timeout=30, pool_recycle=1800)
    )
)


@contextmanager
def connect_db():
    with engine.connect() as conn:

        def db(*args):
            query, *rest = args
            if use_devdb:
                query = query.replace("%s", "?")
            return conn.execute(query, *rest)

        yield db