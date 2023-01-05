
// Global variables
let g_redirect_uri = window.location.href;
let g_client_id = "";
let g_client_secret = "";
let g_refresh_token = "";
let g_access_token = "";

function convertItemsToHTML(items) {
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
            let item = items[types[type]]["items"][itemIndex];
            let name = item["name"];
            let artists = item["artists"].map(artist => artist["name"]).join(", ");
            output += `${name}, by ${artists}<br>`
        }
    }
    return output;
}

async function search() {
    /*
    This function is called when the Search button is pressed.
    */
    let textBoxRef = document.getElementById("textBox");
    let searchQuery = textBoxRef.value;
    if (searchQuery !== ""){
        
        // Execute the search
        let searchOutput = await searchSpotify(searchQuery, g_access_token);
        console.log(searchOutput);

        // Display the results in the HTML
        let outputRef = document.getElementById("output");
        outputRef.innerHTML = convertItemsToHTML(searchOutput);
    }
}

function logOut() {
    // Clear local storage
    localStorage.clear();

    // Redirect back to login page
    window.history.pushState("", "", "/index.html");
    window.location.href = window.location.href;
}
