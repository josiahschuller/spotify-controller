
function generateHash(text) {
    /*
    Hashes the given text using SHA256 hash function.
    Inputs:
    - text (String): text to be hashed
    Output: String of a Base64 encoded value of the hash.
    */
    let hash = CryptoJS.SHA256(text);
    let hashString = hash.toString(CryptoJS.enc.Base64);
    return hashString;
}

function aesEncrypt(plainText, key) {
    /*
    Applies AES encryption on the given plain text with the given key
    Inputs:
    - plainText (String): text to be encrypted
    - key (String): key used in AES encryption/decryption
    Output: String of cipher text
    */
    return CryptoJS.AES.encrypt(plainText, key).toString();
}

function aesDecrypt(cipherText, key) {
    /*
    Applies AES decryption on the given cipher text with the given key
    Inputs:
    - cipherText (String): cipher text to be decrypted
    - key (String): key used in AES encryption/decryption
    Output: String of plain text
    */
    return CryptoJS.AES.decrypt(cipherText, key).toString(CryptoJS.enc.Utf8);
}