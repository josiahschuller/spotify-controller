
// async function authorise() {
//     // Doesn't work
//     let scope = 'user-read-private user-read-email';
//     let response_type = "token";

//     let url = `https://accounts.spotify.com/authorize?response_type=${response_type}&client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${REDIRECT_URI}`
//     let headers = {
//         "Content-Type": "application/json"
//     };
    
//     return getRequest(url, headers)
// }

// async function swapAccessForRefresh() {
//     // Doesn't work
//     let url = `https://api.spotify.com/v1/swap`
//     let headers = {
//         "Content-Type": "application/x-www-form-urlencoded"
//     }
//     let body = "code=BQD9QuvQ-De-AmPVe6dymJrWkrSP9hEJ7ueRTk4MEB_NpMiYfBSHD6YoIvPOQbSLZ7aRDyS8qMQgxmD5UuiaVm0CUg_1NeBFejP6IVf8HWOqDry0GA6WFTuvEaUgMQIyUOneKuGgWusX61RFitADiUREVajDkZrEp5vardYdIKX4aDNDyVvc"

//     let response = await fetch(url, {
//         method: "POST",
//         headers: headers,
//         body: body,
//     });

//     let data = await response.json();

//     return data;
// }

async function refreshAccessToken(refresh_token, client_id, client_secret) {
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
    let token = data["token_type"] + " " + data["access_token"];

    return token;
}

async function getRequest(url, headers=null) {
    /*
    Makes a GET request
    Inputs:
    - url (string): url of the request
    - headers (object): necessary headers
    Output: object of data sent back
    */
    let response = await fetch(url, {headers: headers});

    let data = await response.json();
    return data;
}

async function search(query, auth, type="track") {
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
        "Authorization": auth
    };
    let output;
    await getRequest(url, headers)
        .then((data) => {
            output = data;
        });
    return output;
}