from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS
from flask_cors import cross_origin
from mongo_client import mongo_client

gallary = mongo_client.gallary
images_collection = gallary.images


load_dotenv(dotenv_path="./.env.local")

UNSPLASH_URL = "https://api.unsplash.com/photos/random"
UNSPLASH_KEY = os.environ.get("UNSPLASH_KEY", "")

if not UNSPLASH_KEY:
    raise EnvironmentError("Please create .env.local file and insert unsplash key")
app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})
CORS(app)
# app.config["CORS_HEADERS"] = "Content-Type"
# FLASK_DEBUG = 1
app.config["DEBUG"] = True


@app.route("/new-image")
@cross_origin(origin="*")
def new_image():
    word = request.args.get("query")
    headers = {"Accept-Version": "v1", "Authorization": "Client-ID " + UNSPLASH_KEY}
    params = {"query": word}
    response = requests.get(url=UNSPLASH_URL, headers=headers, params=params)
    data = response.json()
    # print(data)
    return data


@app.route("/images", methods=["GET", "POST"])
def images():
    if request.method == "GET":
        # read images from database
        images = images_collection.find({})
        return jsonify([img for img in images])

    if request.method == "POST":
        # add imege to databse
        image = request.get_json()
        image["_id"] = image.get("id")
        result = images_collection.insert_one(image)
        inserted_id = result.inserted_id
        return {"inserted_id": inserted_id}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5051)
