from .. import app, db
from flask import render_template, flash, redirect, url_for
from forms import SignupForm
from models import User

@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index():
    return render_template(
        'index.html',
    )

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        new_user = User(form.username.data, form.email.data, form.password.data)
        db.session.add(new_user)
        db.session.commit()
        flash('Signed up successfully.', category='success')
        return redirect(url_for('index'))
    return render_template('signup.html', form=form)
