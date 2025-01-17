from flask import Flask, request, render_template, redirect, url_for, jsonify
from models.user import User
from mongoengine.errors import DoesNotExist
from flask_mail import Mail, Message
import pandas as pd
import os
from flask_cors import cross_origin
from services.email_service import send_bulk_emails
from models.mail_data import EmailRecords



app = Flask(__name__)

app.config['MAIL_SERVER']=os.getenv('MAIL_SERVER')
app.config['MAIL_PORT']= int(os.getenv('MAIL_PORT',587))
app.config['MAIL_USE_TLS']= os.getenv('MAIL_USE_TLS')== 'True'
app.config['MAIL_USE_SSL']= os.getenv('MAIL_USE_SSL') == 'True'


@app.route('/register',methods=['POST'])
def register():
    data = request.get_json()
    response, status_code = register_user(data)
    return jsonify(response),status_code


@app.route('/',methods = ['GET'])
def index():
    return render_template('login.html')

@app.route('/upload',methods = ['POST'])
def upload():
   
    file = request.files.get('file')
    email_id = request.form.get('Email')
    password = request.form.get('Password-Email')
    template_html = request.form.get('Subject')
    app.config['MAIL_USERNAME']= email_id
    app.config['MAIL_PASSWORD'] = password
    email = Mail(app)
    return send_bulk_emails(email, file,template_html)


if __name__ == '__main__':
    app.run(debug = True)