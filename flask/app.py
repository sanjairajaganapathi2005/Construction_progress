import os
from flask import Flask, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from similarity import similarity
from pymongo import MongoClient
from pymongo import errors
from dotenv import load_dotenv
from flask_cors import CORS
import gridfs
from io import BytesIO

app = Flask(__name__)
CORS(app)

model = load_model("lightweight_cnn_hybrid.h5")

load_dotenv()

atlas_connection_string = os.getenv("mongo_url")

client = MongoClient(atlas_connection_string)

db = client['construction']
collection = db['prediction']
fs = gridfs.GridFS(db)  # Create a GridFS instance to store files


@app.route('/predict', methods=['POST'])
def predict():
    try:
        f = request.files.get('image')
        s_stage= request.form.get('selectedStage')
        name= request.form.get('username')
        title= request.form.get('title')

        if not f:
            return jsonify({'error': 'No file uploaded'}), 400
        
        img_data = f.read()  # Read the image file content
        
        img = image.load_img(BytesIO(img_data), target_size=(224, 224))

        x = image.img_to_array(img)
        
        x = np.expand_dims(x, axis=0)

        y = model.predict(x)
        preds = np.argmax(y, axis=1)

        stages = ['Foundation', 'Plinth and building', 'Lintel', 'Roofing', 'Plastering', 'Flooring', 'Painting']
        predicted_stage = stages[preds[0]]

        last_record = collection.find_one({'prediction': predicted_stage,'title': title,'username': name}, sort=[('_id', -1)])
        if last_record:
            try:
                filepath1 = BytesIO(fs.get(last_record['file_id']).read())  
                percent = similarity(preds[0], filepath1, BytesIO(img_data))
                percent = percent + last_record['similarity']
                if percent > 100:
                    percent = 100
            except Exception as e:
                print(f"Error processing similarity: {e}")
        else:
            percent = 0
            
        if predicted_stage == s_stage:
            img_file = fs.put(img_data, filename=f.filename)  # Store the image file in GridFS
            prediction_entry = {
                "filename": f.filename,
                "username": name,
                "title": title,
                "file_id": img_file, 
                "prediction": predicted_stage,
                "similarity": percent
            }
            collection.insert_one(prediction_entry)
            print("Data inserted successfully")
        
        print("Predicted stage:", predicted_stage)
        return jsonify({'prediction_text': predicted_stage, 'similarity': percent})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# @app.route('/delete', methods=['POST'])
# def delete_data():
#     data = request.json
#     if data.get('message') == -1:
#         # Find and delete the last inserted record
#         last_record = collection.find_one_and_delete({}, sort=[('_id', -1)])
#         if last_record:
#             fs.delete(last_record['file_id'])  # Delete the file from GridFS
#             return jsonify({'status': 'success', 'message': 'Last data and file deleted successfully'}), 200
#         else:
#             return jsonify({'status': 'error', 'message': 'No data to delete'}), 404
#     else:
#         return jsonify({'status': 'error', 'message': 'Invalid message'}), 400


@app.route('/predictions', methods=['GET'])
def get_predictions():
    try:
        # Fetch all stages with their respective similarity percentages from MongoDB
        predictions = collection.find({}, {"_id": 0, "prediction": 1, "similarity": 1})
        prediction_dict = {pred['prediction']: pred['similarity'] for pred in predictions}

        return jsonify(prediction_dict)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
