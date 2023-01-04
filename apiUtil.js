const CLIENT_ID = "f7893b6abe0d4475ae601778a41d0142";
const CLIENT_SECRET = "a475a2c604b34f1eba4a98076bc2a371";
const REDIRECT_URI = 'http://localhost:8888/callback';

// I got the refresh token from here: https://alecchen.dev/spotify-refresh-token/
const REFRESH_TOKEN = "AQAnyu_nT0-Sxc07nxqacBha_VQEoxcSq-CvBarH8MBxiMLTNCrQYqFcEjwlac7eBNw2zmBHIRBOf8B9Ny893sartlF1ssprQ8x8QTUfMjwChPzSSI310T23v336d-DexOw8Q2XkI0oXlz7HXoiz8rqBhld00oqomr5lbrQQphP1Y_VgWOBL8715EAtKd9u3QwY5myDL0ZAD_rI-Rmvzer6y5EG6r4aoxedXtP_AG6cu14GpsD39fW8yy3MJ7ZjhkPmJ0if3_-WhJLWFJ8KGsmjA1EDaRVfk3uGMInxqG9EcsT-YT1UA-G5itT56jxsaUOARgy2-3RFVTjMGo75_UIZ4YRT9AR1vKPp4eCCYbYj_J1Y6Ol9kyCtXssBh1kDnoPC5K3W5fEs7HjWTMFEAsRgaSgsLc69AZ4OiYSrhJExEkp2-QHGPQqxKyOuXxTIU8EZM-Pjbd-aaPC0S11DdVziTZtS1p67_IEAMVw1Oefo60ECrYHUBBX7xDIKUn50sm_4kOXB0ubZK8KONqh7XWsYHJb4IPRFVn92fN04x64kdaDcYMOY_El_oQ1vI6ndBFHm0KBo0xyI8mvvnvnv811Ug87WQjus_zkUm89Mn4DSZpEVUah3RePQW3iiNoZg0Q8mhSqJmD0YpWqKPRxelhMyy8FYLP1y18mIMRj5btUxOnzUkl7iaQftEicggOvqL66WxDSRf3Lk4VejE6pNJIdcL4OICi7mST40vxMXwDY8";

let auth_token = "";


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

async function refreshAccessToken(refresh_token) {
    /*
    Requests for a new access token
    Inputs:
    - refresh_token (String): Refresh token used to refresh
    Output: String of new access token
    */
    let url = "https://accounts.spotify.com/api/token";
    // https://www.base64encode.org/ is used to encode <client_id:client_secret>
    // If Client ID or Client Secret changes, this needs to be regenerated.
    let headers = {
        "Authorization": "Basic " + "Zjc4OTNiNmFiZTBkNDQ3NWFlNjAxNzc4YTQxZDAxNDI6YTQ3NWEyYzYwNGIzNGYxZWJhNGE5ODA3NmJjMmEzNzE=",
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
    // if (headers === null) {
    //     response = await fetch(url, {mode:"no-cors"});
    // } else {
    //     response = await fetch(url, {headers: headers, mode:"no-cors"});
    // }

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