from flask import Flask,request
import requests
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="./.env.local")

UNSPLASH_URL='https://api.unsplash.com/photos/random'
UNSPLASH_KEY=os.environ.get("UNSPLASH_KEY","")
if not UNSPLASH_KEY:
    raise EnvironmentError("Please create .env.local file and insert unsplash key")
app = Flask(__name__)
# FLASK_DEBUG=1
@app.route("/")
def hello():
    return "Hello, World!"
@app.route("/new-image")
def new_image():
    word = request.args.get("query")
    headers ={
        "Accept-Version":"v1",  
        "Authorization":"Client-ID "+UNSPLASH_KEY
    }
    params ={
        "query":word
    }
    response = requests.get(url=UNSPLASH_URL,headers=headers,params=params)
    data = response.json()
    return {"data":data}

if __name__=="__main__":
    app.run(host="0.0.0.0",port=5050)