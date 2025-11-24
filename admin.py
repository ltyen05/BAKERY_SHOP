from hus_bakery_app import db
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from hus_bakery_app.models import branch, product
from . import app
admin = Admin(app, name="Dashboard")

admin.add_view(ModelView(branch, db.session))
admin.add_view(ModelView(product, db.session))