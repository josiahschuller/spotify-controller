
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

async function onSearch() {
    // Get a new access token
    let token = await refreshAccessToken(REFRESH_TOKEN);
    console.log(token);

    // Execute the search
    let songRef = document.getElementById("searchBox");
    let searchQuery = songRef.value;
    let searchOutput = await search(searchQuery, token);
    console.log(searchOutput);

    // Display the results in the HTML
    let outputRef = document.getElementById("output");
    outputRef.innerHTML = convertItemsToHTML(searchOutput);
}
