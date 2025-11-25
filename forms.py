from flask_wtf import Form
from wtforms import TextFields, SubmitField, validators, PasswordField, HiddenField, BooleanField, IntegerField, FormField
from models import customer

class SignupForm(Form):
    username = TextField('Username',  [
        validators.Required('Please enter your username.'),
        validators.Length(max=50, message='Username is at most 50 characters.'),
    ])
    email = TextField('Email',  [
        validators.Required('Please enter your email address.'),
        validators.Email('Please enter your email address.')
    ])
    phone = TextField('Phone', [
        validators.Required('Please enter your phone number.'),
        validators.Length(max=10, message='Phone number is at most 10 characters.')
    ])
    password = PasswordField('Password', [
        validators.Required('Please enter a password.'),
        validators.Length(min=6, message='Passwords is at least 6 characters.'),
        validators.EqualTo('confirm', message='Passwords must match')
    ])
    confirm = PasswordField('Repeat Password')
    submit = SubmitField('Create account')

    def __init__(self, *args, **kwargs):
        Form.__init__(self, *args, **kwargs)

    def validate(self):
        if not Form.validate(self):
            return False

        user = customer.query.filter_by(username=self.username.data).first()
        if user:
            self.username.errors.append('That username is already taken.')
            return False
        user_email = customer.query.filter_by(email=self.email.data).first()
        if user_email:
            self.username.errors.append('That email is already taken.')
            return False

        return True