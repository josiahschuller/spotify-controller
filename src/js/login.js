
const HASHED_JOSIAH_PASSWORD = "YL1lGNH2jaDFVAPTNXp8Z/yoXpu/5xsbwrHASsbkZuQ=";
const ENCRYPTED_JOSIAH_REFRESH_TOKEN = "U2FsdGVkX1/5ZjwstEbch4D48Oa4ilkCN322OiC82M9gQmL7c9JE7O/S30GPOM81VbJ6o4A+fhFiXGP4iSG0Ci5C7HU/wsC4QEnUE5Hk02lu6nLfBh4QW/xdK2v2lTVM9WmTvVlMnVYLrLHVs3XVkwtg4zXVqmt2XSLqaaKkHdOMAAiLa2KRclLD6Qi3fZ8JPTucpTa/J5+1z6/E9+DDLQ==";

const CLIENT_ID = "f7893b6abe0d4475ae601778a41d0142";
const CLIENT_SECRET = "32a87f23276c4a888fde2c1ffaf7c681";

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
        let urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get("code");
        
        if (code === null) {
            // If the user cancelled the log-in, go back to the log-in page
            window.location.href = getUrlFromPage(window.location.href, "index.html");
        } else {
            // Successful log-in
            // Clear URL
            window.history.pushState("", "", getUrlFromPage(window.location.href, "index.html", "/index.html?code="));
            let redirect_uri = window.location.href;

            // Get tokens
            let tokens = await getTokens(code, client_id, client_secret, redirect_uri);
            console.log(tokens);

            // Save tokens to local storage
            if (tokens["access_token"] != undefined){
                localStorage.setItem("access_token", tokens["access_token"]);
            }
            if (tokens["refresh_token"] != undefined){
                localStorage.setItem("refresh_token", tokens["refresh_token"]);
            }

            // Redirect to controller page
            window.location.href = getUrlFromPage(window.location.href, "controller.html");
        }
    } else if (localStorage.getItem("refresh_token") !== null) {
        // Automatically redirect to controller page if user has previously logged in
        window.location.href = getUrlFromPage(window.location.href, "controller.html");
    }
}

async function clientLogin() {
    /*
    Adds items to the local storage
    Inputs:
    - client_id (String): Client ID for Spotify API
    - client_secret (String): Client Secret for Spotify API
    */

    // If a new user is added, clear keys from local storage

    // Put Client ID and Secret into local storage
    localStorage.setItem("client_id", CLIENT_ID);
    localStorage.setItem("client_secret", CLIENT_SECRET);

    // Execute the Spotify Authorization flow
    let redirect_uri = window.location.href;
    await authorise(CLIENT_ID, redirect_uri);
}

async function josiahLogin() {
    /*
    This function is called when the Login button for Josiah's password is pressed.
    */
    let passwordBoxRef = document.getElementById("josiahPasswordBox");
    
    // Authenticate password
    let passwordGuess = passwordBoxRef.value;
    let authentication = generateHash(passwordGuess) === HASHED_JOSIAH_PASSWORD;

    if (authentication) {
        // Correct password

        // Decrypt encrypted API keys, using the password as the AES key
        let refresh_token = aesDecrypt(ENCRYPTED_JOSIAH_REFRESH_TOKEN, passwordGuess);

        // Get new access token
        let access_token = await getNewAccessToken(refresh_token, CLIENT_ID, CLIENT_SECRET);

        // Set up local storage
        localStorage.setItem("client_id", CLIENT_ID);
        localStorage.setItem("client_secret", CLIENT_SECRET);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("access_token", access_token);

        // Redirect to controller page
        window.location.href = getUrlFromPage(window.location.href, "controller.html");
    } else {
        // Incorrect password
        displayToast("Incorrect password");
    }
}
