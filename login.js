
const HASHED_PASS = "YL1lGNH2jaDFVAPTNXp8Z/yoXpu/5xsbwrHASsbkZuQ=";
const ENCRYPTED_ADMIN_CLIENT_ID = "U2FsdGVkX1+Cw9T4nNXC9cJr5+OeygEPOw+Ulr5A9K0ERFaaGl5grQp4aiklMaHsL7vkq7azTMhOV4syasBPRQ==";
const ENCRYPTED_ADMIN_CLIENT_SECRET = "U2FsdGVkX189vxEJWKZ1FS7RLlk9wb13H5PAcprOt3PzbQgxWV0uu5rsrulfUCPVlrvDxw78EyhHuRkMI4yP1Q==";

async function onPageLoad() {
    /*
    All the stuff that happens when the page loads
    */
    if (window.location.search.length > 0) {
        // This section is for finishing authorisation after being redirected after logging in to Spotify

        // Get stuff from local storage
        let client_id = localStorage.getItem("client_id");
        let client_secret = localStorage.getItem("client_secret");
        // Get code from URL
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get("code");

        // Clear URL
        window.history.pushState("", "", "/index.html");
        let redirect_uri = window.location.href;

        // Get tokens
        let tokens = await getTokens(code, client_id, client_secret, redirect_uri);

        // Save tokens to local storage
        if (tokens["access_token"] != undefined){
            localStorage.setItem("access_token", tokens["access_token"]);
        }
        if (tokens["refresh_token"] != undefined){
            localStorage.setItem("refresh_token", tokens["refresh_token"]);
        }

        // Redirect to controller page
        window.location.href = "controller.html";
    }
}

async function setLocalStorage(aesKey) {
    /*
    Adds items to the local storage
    Inputs:
    - aesKey (String): key for AES encryption/decryption
    */
    // Decrypt encrypted keys, using the password as the AES key
    let client_id = aesDecrypt(ENCRYPTED_ADMIN_CLIENT_ID, aesKey);
    let client_secret = aesDecrypt(ENCRYPTED_ADMIN_CLIENT_SECRET, aesKey);

    // If a new user is added, clear keys from local storage
    if (localStorage.getItem("client_id") !== client_id) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }

    // Put Client ID and Secret into local storage
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);

    // Check if a refresh token exists in local storage
    if (localStorage.getItem("refresh_token") !== null) {
        // Get refresh token from local storage
        let refresh_token = localStorage.getItem("refresh_token");
        // Generate new access token
        let access_token = await getNewAccessToken(refresh_token, client_id, client_secret);
        localStorage.setItem("access_token", access_token);
    } else {
        // No refresh token, so authorization is required
        let redirect_uri = window.location.href;
        await authorise(client_id, redirect_uri);
    }
}

async function login() {
    /*
    This function is called when the Login button is pressed.
    */
    let textBoxRef = document.getElementById("textBox");
    let outputRef = document.getElementById("output");
    
    // Authenticate password
    let passwordGuess = textBoxRef.value;
    let authentication = generateHash(passwordGuess) === HASHED_PASS;

    if (authentication) {
        // Correct password

        // Set up local storage
        await setLocalStorage(passwordGuess);
    } else {
        // Incorrect password
        outputRef.innerText = "Incorrect password";
    }
}