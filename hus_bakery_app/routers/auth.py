from flask import Blueprint, render_template, flash, redirect, url_for
from .. import db
from ..forms.signup import SignupForm
from ..models.customer import Customer

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/', methods=['GET', 'POST'])
@auth_bp.route('/index', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        new_customer = Customer(
            name=form.name.data,
            email=form.email.data,
            phone=form.phone.data,
            password=form.password.data
        )

        try:
            db.session.add(new_customer)
            db.session.commit()
            flash('Signed up successfully.', category='success')
            return redirect(url_for('auth.index'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error: {str(e)}', category='danger')

    return render_template('signup.html', form=form)