
function extractSongInfo(song) {
    /*
    Gets key information from item object about a song
    Inputs:
    - song (Object): information of item from Spotify API
    Output: String of key information about song
    */
    let name = song["name"];
    let artists = song["artists"].map(artist => artist["name"]).join(", ");
    let duration = convertMsToTime(song["duration_ms"]);
    return `${name}  |  ${artists}  |  ${duration}`;
}

async function convertItemsToHTML(items) {
    /*
    Converts an object of items to HTML
    Inputs:
    - items (Object): Object of items from Spotify API
    Output: String of HTML to display the items
    */
    let types = ["tracks"]; // Update this when the scope of types is increased
    let output = ""
    for (let type in types) {
        for (let itemIndex in items[types[type]]["items"]) {
            // Extract information from object
            let item = items[types[type]]["items"][itemIndex];

            // Setup information for adding song to queue
            let song_uri = item["uri"];

            // Construct HTML output
            output += `
            <a style="text-decoration: none;" href="javascript:addToQueueWrapper('${song_uri}')">
            <div class="mdl-list__item song">
                <span class="mdl-list__item-primary-content">
                    <span">${extractSongInfo(item)}</span>
                </span>
                <i class="material-icons">add</i>
            </div>
            </a><br>`;
        }
    }
    return output;
}

async function addToQueueWrapper(songUri) {
    /*
    Adds a song to the queue after checking if a device is active
    - songUri (String): URI of song to be added to queue
    */
    let auth = localStorage.getItem("access_token");
    let device_id = await getDeviceId(auth);
    
    // Check if a device is active
    if (device_id != null && device_id != "null") {
        // A device is active
        displayToast("Song added to queue");
        await addToQueue(songUri, device_id, auth);
    } else {
        // No devices are active
        displayToast("No available devices");
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

async function displayCurrentPlayback() {
    /*
    Displays the current playback state in the HTML
    */
    let access_token = localStorage.getItem("access_token");
    let market = "AU";
    let output = "";

    let stateData;
    try {
        stateData = await getPlaybackInformation(access_token, market);
        if ("error" in stateData) {
            // If request fails, renew access token
            let refresh_token = localStorage.getItem("refresh_token");
            let client_id = localStorage.getItem("client_id");
            let client_secret = localStorage.getItem("client_secret");

            access_token = await getNewAccessToken(refresh_token, client_id, client_secret);
            console.log(`New access token: ${access_token}`)
            localStorage.setItem("access_token", access_token);

            // Try again
            stateData = await getPlaybackInformation(access_token, market);
            console.log(stateData);
        }

    } catch (exception) {
        if (exception instanceof SyntaxError) {
            console.log("No device has Spotify open. See syntax error below:");
        }
        console.log(exception);
    }

    if (stateData == null) {
        // No devices with Spotify open
        output = "No available devices. Play a song on your device and try again.";
    } else {
        // There is a device with Spotify open
        if (stateData["is_playing"]) {
            // Song is playing on the device
            // Extract information from object
            output = `Currently playing: ${extractSongInfo(stateData["item"])}`;
        } else {
            // No song is playing on the device
            output = "Device available. No song is currently playing.";
        }
    }
    
    document.getElementById("control").innerHTML = `<p>${output}</p>`;
}

setInterval(displayCurrentPlayback, 10000);