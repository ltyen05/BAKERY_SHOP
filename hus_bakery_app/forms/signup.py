from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from ..models.customer import Customer

class SignupForm(FlaskForm):
    name = StringField('Username', validators=[
        DataRequired(message='Please enter your username.'),
        Length(max=50, message='Username is at most 50 characters.')
    ])
    email = StringField('Email', validators=[
        DataRequired(),
        Email(message='Invalid email address.')
    ])
    phone = StringField('Phone', validators=[
        DataRequired(),
        Length(max=20, message='Phone number is at most 20 characters.')
    ])
    password = PasswordField('Password', validators=[
        DataRequired(),
        Length(min=6, message='Password must be at least 6 characters.'),
        EqualTo('confirm', message='Passwords must match')
    ])
    confirm = PasswordField('Repeat Password')
    submit = SubmitField('Create account')

    def validate_name(self, name):
        user = Customer.query.filter_by(name=name.data).first()
        if user:
            raise ValidationError('Tên đăng nhập này đã tồn tại.')

    def validate_email(self, email):
        user = Customer.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Email này đã tồn tại.')