from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

dbUrl = "mysql+pymysql://root:@localhost/opd"

engine = create_engine(dbUrl)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()


def get_db() :
    db = SessionLocal()
    try :
        yield db
    finally :
        db.close()
