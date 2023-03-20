PASSWORD = "password"
ACCESS_TOKEN = "access token"

def check_password(guess: str) -> bool:
    return guess == PASSWORD

def get_access_token(password: str) -> bool:
    if password == PASSWORD:
        return {"access_token": ACCESS_TOKEN}
    else:
        return {"error": "Invalid password"}