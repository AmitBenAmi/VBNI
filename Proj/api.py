from flask import Flask, request
from sklearn.externals import joblib
from sklearn.tree import DecisionTreeClassifier
import pandas as pd
import pickle
import json

classifier = joblib.load('classifier.pkl')
regressor = joblib.load('regression.pkl')
labels = pickle.load(open("labels.p", "rb"))

app = Flask(__name__)


@app.route('/classify')
def classify():
    #Get the row we want to predict
    row = request.args.to_dict()
    for key, val in row.items():
        row[key] = getLabelValue(key,val)

    df = pd.DataFrame([row], columns=row.keys())
    res = classifier.predict_proba(df)
    print (res)
    values = res[0]
    if values[0] > values[1]:
        result = {
            'value': 0,
            'prob': values[0]
        }
    else:
        result = {
            'value': 1,
            'prob': values[1]
        }
    jsonStr = json.dumps(result)
    return jsonStr


@app.route('/regression')
def regression():
    # Get the row we want to predict
    row = request.args.to_dict()
    for key, val in row.items():
        row[key] = getLabelValue(key, val)

    df = pd.DataFrame([row], columns=row.keys())
    res = regressor.predict(df)
    print (res)
    jsonStr = json.dumps({'estimation': res[0]})
    return jsonStr


def getLabelValue(label, val):
    allValues = labels[label]
    if allValues is None:
        return val;
    for idx, curr in enumerate(allValues):
        if curr == val:
            return idx;
    return val;

if __name__ == '__main__':
    app.run(debug=True)




