
const HASHED_PASS = "YL1lGNH2jaDFVAPTNXp8Z/yoXpu/5xsbwrHASsbkZuQ=";

const ENCRYPTED_CLIENT_ID = "U2FsdGVkX1+Cw9T4nNXC9cJr5+OeygEPOw+Ulr5A9K0ERFaaGl5grQp4aiklMaHsL7vkq7azTMhOV4syasBPRQ==";
const ENCRYPTED_CLIENT_SECRET = "U2FsdGVkX198b/TKjZvh++0VCnQC4T4i3HbpPbFwMKzxI+ltLpyUPxBbdi0y6jFgUngQ5cPjtpczZp1qAav7zQ==";
const REDIRECT_URI = 'http://localhost:8888/callback';
const ENCRYPTED_REFRESH_TOKEN = "U2FsdGVkX18zteAY8AQCHt4tN+YzVFZf4x95/ZiwojEtw9l6CZZuEhcyKAd+oWSJ5P59CwYiylCsBDwrnAyOB98nbyAXLm1y3P9UefJ3Nmc5ItvcS6vFmIzJ2D3KDERaej/HsEt7+VV8IZl7SsEKyJKQXXK5XK6YTtDx1/twptOJeAxPqC3n0s28FYCTg4lGWLx9HKlzXDt8lok+bqer5yVtytiRuySvL25Z9haHwBi2/TX/9neT/HFbd7ykCyreIfOyUtCY4Nn3gRIa5lj4rEAccNHEKWluqY0xASaodatSFkqKb/61AakDqA7K9vRCmZzz/Ilt6GBYvSPsWO5nZzAifgy2tgLhZIrP14FeGqE+MAP6k1b8igy5kJnfQmSTqw3f4GFwpUMjrFaRJArTlT2KhT/PtAk10G50kue9agqh3xfGD6C5y8OW578To0Wvo12fUfxGl3BiWUGoWUuEWsBzjBNk5ejBB/IEZg7qOGySSpWTs3P5a9e45/T/nM+5pqVFd/J9H/8pfEfxLXasOw9GeqnYzK9WPebHrw3OJ5GcE43ZNbK9xrt2vtbtNJ4XG4jwPrqtEupB2FqHO99yjSlg/mFaB3aIispzTBUXBidfk8/JVKhZc2W9HWBRgFVjOytbQLLAZeOcvZ2vUI6gLpyKOpUVGWPj2LCSUhpYZDTN4RwP6uLVKpjsgp02gV6KEsu1AYneK7J7bEA8og6OYnNqh4VMXBK1fokOk63+5MJ+0yZZHxNi8imD3CPzPLpC1kmMuPqSGygCGYnbkH0RdWoznO6a3rUMcmEZxvm5Imvjwdv1yxaFzspKKW3HNOLZR3VhmVUPYsp6lhsF3WaisO6WX0q8VsHPTNk/XgFNKhNHdvqEq/dfZKkecYBIK97X13Dn2CAhfKTJIJJNiKuKl8CXWjUYGOYTZQk6fInXSm2I9F2b00Bvv0HT6ZmgOKShKvRXAttEVT3+qPKZMkA0W3gtuQ1bAbP+Ni3YjUhLUoqyXg0qZxM85aAAQVgxcsnG";

let client_id = "";
let client_secret = "";
let refresh_token = "";
let authToken = "";
let aesKey = "";


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
    // Get a new access token
    let token = await refreshAccessToken(refresh_token, client_id, client_secret);

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

function login() {
    /*
    This function is called when the Login button is pressed.
    */
    let textBoxRef = document.getElementById("textBox");
    let textBoxLabelRef = document.getElementById("textBoxLabel");
    let buttonRef = document.getElementById("button");
    let outputRef = document.getElementById("output");
    let formRef = document.getElementById("form");
    
    // Authenticate password
    let passwordGuess = textBoxRef.value;
    let authentication = generateHash(passwordGuess) === HASHED_PASS;

    if (authentication) {
        // If authenticated, then change HTML to Spotify controller functionality
        textBoxRef.value = "";
        textBoxLabelRef.innerText = "Song";
        buttonRef.innerText = "Search";
        outputRef.innerText = "";
        
        // Use the password as the key for AES encryption/decryption
        aesKey = passwordGuess;

        // Decrypt encrypted keys
        client_id = aesDecrypt(ENCRYPTED_CLIENT_ID, aesKey);
        client_secret = aesDecrypt(ENCRYPTED_CLIENT_SECRET, aesKey);
        refresh_token = aesDecrypt(ENCRYPTED_REFRESH_TOKEN, aesKey);
    } else {
        // Incorrect password guess
        outputRef.innerText = "Incorrect password";
    }
}

async function onFormSubmission() {
    if (generateHash(aesKey) === HASHED_PASS) {
        // Logged in
        await search();
    } else {
        // Not logged in
        login();
    }
}
