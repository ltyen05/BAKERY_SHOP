import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'ban-khong-the-doan-duoc-dau'
