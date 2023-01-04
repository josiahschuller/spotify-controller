
const HASHED_PASS = -2354572330;

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
    /*
    This function is called when the Search button is pressed.
    */
    // Get a new access token
    let token = await refreshAccessToken(REFRESH_TOKEN);
    console.log(token);

    // Execute the search
    let textBoxRef = document.getElementById("textBox");
    let searchQuery = textBoxRef.value;
    if (searchQuery !== ""){
        let searchOutput = await search(searchQuery, token);
        console.log(searchOutput);

        // Display the results in the HTML
        let outputRef = document.getElementById("output");
        outputRef.innerHTML = convertItemsToHTML(searchOutput);
    }

}

function generateHash(text) {
    /*
    Hashes the given text using SHA256 hash function.
    Inputs:
    - text (String): text to be hashed
    Output: Number of a reduced value of the hash.
    */
    let hash = CryptoJS.SHA256(text);
    let reducedHash = hash.words.reduce((x, y) => x + y, 0);
    return reducedHash;
}

function onLogin() {
    /*
    This function is called when the Login button is pressed.
    */
    let textBoxRef = document.getElementById("textBox");
    let textBoxLabelRef = document.getElementById("textBoxLabel");
    let buttonRef = document.getElementById("button");
    let outputRef = document.getElementById("output");
    
    // Authenticate password
    let authentication = generateHash(textBoxRef.value) === HASHED_PASS;

    if (authentication) {
        // If authenticated, then change to proper app
        textBoxRef.value = "";
        textBoxLabelRef.innerText = "Song";
        buttonRef.innerText = "Search";
        buttonRef.onclick = onSearch;
        outputRef.innerText = "";
    } else {
        outputRef.innerText = "Incorrect password";
    }
}
