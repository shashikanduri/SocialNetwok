import axios from "axios";

let pdsStatus = null
let snStatus = null

export async function postPDS(formData, url){

    pdsStatus = await axios.post(url,formData).catch((e) => { pdsStatus = e} )
    return pdsStatus
}

export async function postSN(formData){

      snStatus = axios.post("http://localhost:8082/api/users/SavePost",formData).catch((e) => {snStatus = e})
      return snStatus
}
    
