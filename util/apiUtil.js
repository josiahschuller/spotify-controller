
function getUrlFromPage(currentUrl, page, delimiter='/') {
    /*
    Finds the URL of the given page
    Inputs:
    - currentUrl (String): URL of page currently open
    - page (String): path to HTML file (which a URL is being found for)
    - delimiter (String): separator between base of URL and page
    */
    let output;
    for (let i = currentUrl.length-delimiter.length-1; i >= 0; i--) {
        if (currentUrl.substring(i, i+delimiter.length) === delimiter) {
            // Stop after finding the last delimiter in the URL
            output = currentUrl.substring(0, i+1);
            console.log(output);
            break;
        }
    }
    output += page;
    return output;
}


async function authorise(client_id, uri) {
    /*
    Authorises user for log-in
    */
    let scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming';

    let url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${uri}&show_dialog=true`
    
    window.location.href = url;
}

async function getTokens(code, client_id, client_secret, redirect_uri) {
    /*
    Requests for a new access token
    Inputs:
    - code (String): Code received from initial authorisation
    - client_id (String): Client ID of Spotify user
    - client_secret (String): Client Secret of Spotify user
    - redirect_uri (String): URI to redirect to after authorisation
    Output: String of new access token
    */
    let url = "https://accounts.spotify.com/api/token";
    let base64 = btoa(`${client_id}:${client_secret}`);

    let body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI(redirect_uri)}&client_id=${client_id}&client_secret=${client_secret}`;

    let headers = {
        "Authorization": "Basic " + base64,
        "Content-Type": "application/x-www-form-urlencoded"
    };

    // Execute request
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
        json: true
    });

    let data = await response.json();
    console.log(data);

    return data;
}

async function getNewAccessToken(refresh_token, client_id, client_secret) {
    /*
    Requests for a new access token
    Inputs:
    - refresh_token (String): Refresh token used to refresh
    - client_id (String): Client ID of Spotify user
    - client_secret (String): Client Secret of Spotify user
    Output: String of new access token
    */
    let url = "https://accounts.spotify.com/api/token";

    // Encode <client_id:client_secret> into Base64
    let base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(`${client_id}:${client_secret}`));
    let headers = {
        "Authorization": "Basic " + base64,
        "Content-Type": "application/x-www-form-urlencoded"
    };

    let body = `grant_type=client_credentials&refresh_token=${refresh_token}`

    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
        json: true
    });

    let data = await response.json();
    let token = data["access_token"];

    return token;
}

async function searchSpotify(query, auth, type="track") {
    /*
    Searches for an item with the Spotify API
    Inputs:
    - query (String): the search query
    - auth (String): the access token
    - type (String): the type of item
    Output: Object of data returned from API
    */
    let url = `https://api.spotify.com/v1/search?q=${query}&type=${type}&include_external=audio`;
    
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + auth
    };

    let response = await fetch(url, {headers: headers});
    let data = await response.json();

    return data;
}
