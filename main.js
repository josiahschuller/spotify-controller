
const CLIENT_ID = "f7893b6abe0d4475ae601778a41d0142";
const CLIENT_SECRET = "a475a2c604b34f1eba4a98076bc2a371";
const AUTH = "BQArBWlxEvZFuTOYYO5Cyk2HhKj9i7-p44ejQssAnciN1iVl4-Rp0pO190LzOSYN2Vx4r9am7BcAF-E8lAu8P7DWoB-VI0bAmEA5pK11vF2N2Otfc6uAtspkcoMHSUBAlOshcKYBQdZZVu-qD4a3KVPG9LZ2Ece7imc20F4ntJicBV-h7Y2Y0-UmbE7DWtceRwVNnEM6W1huohZQB4fqqxGE3w";

// async function authorise() {
//     let redirect_uri = 'http://localhost:8888/callback';
//     let scope = 'user-read-private user-read-email';
//     let response_type = "code";

//     let url = `https://accounts.spotify.com/authorize?response_type=${response_type}&client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${redirect_uri}`
//     let headers = {
//         "Content-Type": "application/json"
//     };
    
//     return getRequest(url, headers)
// }


async function getRequest(url, headers=null) {
    /*
    Makes a GET request
    Inputs:
    - url (string): url of the request
    - headers (object): necessary headers
    Output: object of data sent back
    */
    let response;
    if (headers === null) {
        response = await fetch(url, {mode:"no-cors"});
    } else {
        response = await fetch(url, {headers: headers, mode:"no-cors"});
    }
    
    console.log(response);
    let data = await response.json();
    return data;
}

async function search(query, type="track") {
    /*
    Searches for an item with the Spotify API
    Inputs:
    - query (String): the search query
    - type (String): the type of item
    Output: ?
    */
    let url = `https://api.spotify.com/v1/search?q=${query}&type=${type}&include_external=audio`;
    let headers = {
        "Authorization": AUTH,
        "Content-Type": "application/json"
    };
    let data = await getRequest(url, headers);
    return data;
}

async function onSearch() {
    let songRef = document.getElementById("searchBox");
    let searchQuery = songRef.value;
    console.log(searchQuery);
    console.log(search(searchQuery));
}