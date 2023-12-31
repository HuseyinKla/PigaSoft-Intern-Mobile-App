import axios from "axios";
import Config from "react-native-config";

const { useState, useEffect } = require("react");



function useFetchCategories(url, postData){

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchDataGet =  async () => {
        try {
            const responseData = await axios.get(url)
            setData(responseData.data)
            setLoading(false)
            console.log("get işlem sonucu: ",responseData.status)
        } catch (error) {
            setLoading(false)
            setError(error)
        }
    }

    const fetchDataPost =  async () => {
        try {
            const responseData = await axios.post(url, postData,
                {
                    headers: axios.defaults.headers['Content-Type'] = 'multipart/form-data'
                })
                setData(responseData.data)
                setLoading(false)
                console.log("post işlem sonucu: ",responseData.status)
        } catch (error) {
            setLoading(false)
            setError(error)
        }
    }

    useEffect(()=> {
        axios.defaults.headers['X-API-KEY'] = Config.API_KEY;
        console.log("post data ile gelen veriler: ",postData)
        if(postData){
            fetchDataPost()
        }else{
            fetchDataGet()
        }
    },[])

    return {data, loading, error}

}

export default useFetchCategories