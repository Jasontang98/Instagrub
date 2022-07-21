from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    prof_pic_url = db.Column(db.String(255), nullable=True, default='https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg')
    description = db.Column(db.String(500), nullable=True)

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'prof_pic_url': self.prof_pic_url,
            'description': self.description
        }


    image = db.relationship('Image', back_populates='user', cascade='all, delete-orphan')
    comment = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    image_like = db.relationship('Image_Like', back_populates='user')
    comment_like = db.relationship('Comment_Like', back_populates='user')
