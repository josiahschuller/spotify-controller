from flask import Flask, request
import backend.auth

app = Flask(__name__)

@app.route("/authenticate")
def check_password():
    guess = request.args.get("password", default = "", type = str)
    return str(backend.auth.check_password(guess=guess))

@app.route("/getAccessToken")
def get_access_token():
    password = request.args.get("password", default = "", type = str)
    return backend.auth.get_access_token(password=password)

if __name__ == '__main__':
    app.run(debug=True)
