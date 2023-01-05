
async function convertItemsToHTML(items, auth) {
    /*
    Converts an object of items to HTML
    Inputs:
    - items (Object): Object of items from Spotify API
    - auth (String): access-token for Spotify API
    Output: String of HTML to display the items
    */
    let types = ["tracks"]; // Update this when the scope of types is increased
    let output = ""
    for (let type in types) {
        for (let itemIndex in items[types[type]]["items"]) {
            // Extract information from object
            let item = items[types[type]]["items"][itemIndex];
            let name = item["name"];
            let artists = item["artists"].map(artist => artist["name"]).join(", ");
            let duration = convertMsToTime(item["duration_ms"]);

            // Setup information for adding song to queue
            let song_uri = item["uri"];
            let device_id = await getDeviceId(auth);

            // Construct HTML output
            output += `
            <a href="javascript:addToQueueWrapper('${song_uri}', '${device_id}', '${auth}')">
            <div class="mdl-list__item">
                <span class="mdl-list__item-primary-content">
                    <span>${name}, by ${artists} (${duration})</span>
                </span>
                <i class="material-icons">add</i>
            </div>
            </a><br>`;
        }
    }
    return output;
}

async function addToQueueWrapper(songUri, device_id, auth) {
    /*
    Adds a song to the queue after checking if a device is active
    - songUri (String): URI of song to be added to queue
    - device_id (String): ID of device to be played on
    - auth (String): access token for Spotify API
    */
    console.log(device_id);
    // Check if a device is active
    if (device_id != null && device_id != "null") {
        // A device is active
        console.log("Song added to queue");
        await addToQueue(songUri, device_id, auth);
    } else {
        // No devices are active
        console.log("No devices available");
    }
}

async function search() {
    /*
    This function is called when the Search button is pressed.
    */
    let textBoxRef = document.getElementById("textBox");
    let searchQuery = textBoxRef.value;
    if (searchQuery !== ""){
        // Retrieve access token from local storage
        let access_token = localStorage.getItem("access_token");
        
        // Execute the search
        let searchOutput;
        try {
            searchOutput = await searchSpotify(searchQuery, access_token);
        } catch {
            // If request fails, renew access token
            let refresh_token = localStorage.getItem("refresh_token");
            let client_id = localStorage.getItem("client_id");
            let client_secret = localStorage.getItem("client_secret");

            access_token = getNewAccessToken(refresh_token, client_id, client_secret)
            localStorage.setItem("access_token", access_token);

            // Try again
            searchOutput = await searchSpotify(searchQuery, access_token);
        }
        console.log(searchOutput);

        // Display the results in the HTML
        let outputRef = document.getElementById("output");
        outputRef.innerHTML = await convertItemsToHTML(searchOutput, access_token);
    }
}

function logOut() {
    // Clear local storage
    localStorage.clear();

    // Redirect back to login page
    window.location.href = getUrlFromPage(window.location.href, "index.html");
}
