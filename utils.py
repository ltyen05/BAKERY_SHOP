import json

def read_json(path):
    with open(path) as json_file:
        return json.load(json_file)

