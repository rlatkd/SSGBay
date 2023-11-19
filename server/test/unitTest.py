from api import app, database
import pytest
import json
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token

@pytest.fixture
def api():
    app = database.test_database
    database['TESTING'] = True
    api = app.test_client()

    return api


def test_ping(api):
    resp = api.get('/ping')
    assert b'pong' in resp.data   

    
def test_tweet(api):
    new_user = {
        'dummydata': 'dummy'
    }
    resp = api.post(
        '/signup',
        data=json.dumps(new_user),
        content_type='application/json'
    )
    assert resp.status_code == 200

    resp_json = json.loads(resp.data.decode('utf-8'))
    new_user_id = resp_json['id']


    resp = api.post(
        '/login',
        data=json.dumps({'dummydata': 'dummy'}),
        content_type='application/json'
    )
    resp_json = json.loads(resp.data.decode('utf-8'))
    access_token = resp_json['access_token']


    # resp = api.post(
    #     '/tweet',
    #     data=json.dumps({'tweet': 'Hello World'}),
    #     content_type='application/json',
    #     headers={'Authorization': access_token}
    # )
    # assert resp.status_code == 200

    # resp = api.get(f'/timeline/{new_user_id}')
    # tweets = json.loads(resp.data.decode('utf-8'))

    # assert resp.status_code == 200
    # assert tweets == {
    #     'user_id': 1,
    #     'timeline' : [
    #         {
    #             'user_id': 1,
    #             'tweet': 'Hello World'
    #         }
    #     ]
    # }