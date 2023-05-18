import { pki, util } from "node-forge";
import { md } from "node-forge";
import axios from "axios";

const crypto = require("crypto")

export async function creatersakeys(){
    const options = {
        bits: 2048,
        e: 65537 // use 65537 as the public exponent
    }
    try{
        const rsaKeyPair = pki.rsa.generateKeyPair()
        //console.log(rsaKeyPair.publicKey)
        let rsaPublicKey = pki.publicKeyToPem(rsaKeyPair.publicKey)
        let rsaPrivateKey = pki.privateKeyToPem(rsaKeyPair.privateKey)
        return {rsaPublicKey, rsaPrivateKey}

    }catch(e){
        return null
    }

}

export async function createAndComputeDHSecret(){

    try{
        const prime = crypto.getDiffieHellman('modp15').getPrime()
        const gen = crypto.getDiffieHellman('modp15').getGenerator()

        const dh = crypto.createDiffieHellman(prime, gen);
        dh.generateKeys();

        let clientPublicKey = dh.getPublicKey('hex')
        //console.log(clientPublicKey)
        //localStorage.setItem("dhpublic", clientPublicKey);
        let clientPrivateKey = dh.getPrivateKey('hex')
        //localStorage.setItem("dhprivate", clientPrivateKey)

        let url = "http://localhost:8080/api/users/getPDSKey"
            
        let response = await axios.get(url).catch(e => {return e.response.data.message})
        
        let serverPublicKey = response.data.message
        //localStorage.setItem("pdskey",serverPublicKey)

        let key = dh.computeSecret(Buffer.from(serverPublicKey,'hex'),null,null);
        //localStorage.setItem("dhsecret", key.toString('hex'))
        return {key, clientPublicKey, clientPrivateKey, serverPublicKey}

    }catch(e){
        return null
    }

}

export async function AESEncryption(data, key){

    try{
        const iv = crypto.randomBytes(16);
        const ivString = iv.toString('base64')
        //console.log("iv: " + ivString)

        const cipher = crypto.createCipheriv('aes256', key.subarray(0,32), iv);

        let encryptedData = cipher.update(data,'utf-8')

        encryptedData = Buffer.concat([encryptedData, cipher.final()]);
        let encryptedDataBase64 = encryptedData.toString('base64')

        return {ivString, encryptedDataBase64}

    }catch(e){
        return null
    }

}

export async function createSignature(data, email){

    try{
        const userDataString = localStorage.getItem(email)
        const userData = JSON.parse(userDataString)

        let rsap = userData.rsa.rsaPrivateKey
        let rsaPrivateKey = pki.privateKeyFromPem(rsap)

        const sha256 = md.sha256.create()
        sha256.update(data,"utf8")
        sha256.digest()
        let sig = rsaPrivateKey.sign(sha256)
        let signature = util.encode64(sig)
        return signature
    }catch(e){
        return "error"
    }
    
}

export function AESDecryption(encryptedImg, iv, key){
    
    const cipher = crypto.createDecipheriv('aes256', key.subarray(0,32), Buffer.from(iv,'base64'));
    let decryptedData = cipher.update(encryptedImg,'base64');
    decryptedData = Buffer.concat([decryptedData, cipher.final()]);
    return decryptedData.toString('utf-8')
}