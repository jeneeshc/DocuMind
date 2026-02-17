from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = "sqlite:///./test_results.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class TestResultDB(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(String, unique=True, index=True)
    test_type = Column(String)
    timestamp = Column(DateTime)
    sample_size = Column(Integer)
    
    # metrics
    p_value = Column(Float)
    stat_statistic = Column(Float)
    significant = Column(Boolean)
    
    # averages
    avg_processing_time = Column(Float, nullable=True)
    avg_cost = Column(Float, nullable=True)
    avg_accuracy = Column(Float, nullable=True)
    avg_token_usage = Column(Integer, nullable=True)
    f2_score = Column(Float, nullable=True) # RQ3
    
    # detailed results stored as JSON
    details = Column(JSON)

def init_db():
    Base.metadata.create_all(bind=engine)
