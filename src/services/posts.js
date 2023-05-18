import axios from "axios";

let pdsStatus = null
let snStatus = null
let signupStatus = null
let loginStatus = null
let postData = null
let signupStatusSN = null
export async function postPDS(formData, url){

    pdsStatus = await axios.post(url,formData).catch((e) => { pdsStatus = e} )
    return pdsStatus
}

export async function postSN(formData){

      snStatus = await axios.post("http://localhost:8082/api/users/SavePost",formData).catch((e) => {snStatus = e})
      return snStatus
}
    
export async function signup(formData, url){
    signupStatus = await axios.post(url,formData).catch((e) => { signupStatus = e })
    return signupStatus
}

export async function signupSN(formData, url){
    signupStatusSN = await axios.post(url,formData).catch((e) => { signupStatusSN = e })
    return signupStatusSN
}

export async function login(formData, url){

    loginStatus = await axios.post(url,formData).catch(e => {loginStatus = e})
    return loginStatus
}

export async function getpost(sig, email){

    let url = "http://localhost:8080/api/posts/getpost"
    postData = await axios.get(url, {params:{
        digitalSignature: sig,
        email: email
    }})
    return postData
}