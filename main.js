
function convertItemsToHTML(items) {
    /*
    Converts an object of items to HTML
    Inputs:
    - items (Object): Object of items from Spotify API
    Output: String of HTML to display the items
    */
   return "";
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