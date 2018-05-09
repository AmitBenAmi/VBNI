from flask import Flask, request
from flask_cors import CORS, cross_origin
from sklearn.externals import joblib
from sklearn.tree import DecisionTreeClassifier
import pandas as pd
import pickle
import json
from random import randint

classifier = joblib.load('classifier.pkl')
regressor = joblib.load('regression.pkl')
labels = pickle.load(open("labels.p", "rb"))

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/classify')
@cross_origin()
def classify():
    #Get the row we want to predict
    row = request.args.to_dict()
    for key, val in row.items():
        row[key] = getLabelValue(key,val)

    df = pd.DataFrame([row], columns=row.keys())
    res = classifier.predict_proba(df)
    estimation = regressor.predict(df)
    print (res)
    values = res[0]
    result = {
        'estimation': estimation[0],
        'prob': values[1]
    }
    json_str = json.dumps(result)
    return json_str
#
#
# @app.route('/regression')
# def regression():
#     # Get the row we want to predict
#     row = request.args.to_dict()
#     for key, val in row.items():
#         row[key] = getLabelValue(key, val)
#
#     df = pd.DataFrame([row], columns=row.keys())
#     res = regressor.predict(df)
#     print (res)
#     jsonStr = json.dumps({'estimation': res[0]})
#     return jsonStr
#


def getLabelValue(label, val):
    allValues = labels[label]
    if allValues is None:
        return val;
    for idx, curr in enumerate(allValues):
        if curr == val:
            return idx;
    return randint(0,1000);

if __name__ == '__main__':
    app.run(debug=True)




