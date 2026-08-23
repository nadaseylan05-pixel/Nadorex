import os
import firebase_admin
from firebase_admin import messaging
from firebase_admin import credentials
from django.conf import settings

# if not firebase_admin._apps:
#     cred = credentials.Certificate(
#         os.path.join(
#             settings.BASE_DIR,
#             "nadorex-90275-firebase-adminsdk-fbsvc-8a0d8dfb0a.json"
#         )
#     )

#     firebase_admin.initialize_app(cred)
    

import os
import json
import firebase_admin
from firebase_admin import credentials
from django.conf import settings


if not firebase_admin._apps:

    firebase_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT")

    if firebase_json:
        cred = credentials.Certificate(
            json.loads(firebase_json)
        )
    else:
        cred = credentials.Certificate(
            os.path.join(
                settings.BASE_DIR,
                "nadorex-90275-firebase-adminsdk-fbsvc-8a0d8dfb0a.json.json"
            )
        )

    firebase_admin.initialize_app(cred)

def send_push_notification(token, title, body):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        token=token,
    )

    response = messaging.send(message)

    return response