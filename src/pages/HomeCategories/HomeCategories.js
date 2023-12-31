import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableWithoutFeedback, View } from 'react-native'
import useFetchCategories from '../../hooks/useFetchCategories'
import Config from 'react-native-config'
import HomeCategoriesCard from '../../components/HomeCategoriesCard/HomeCategoriesCard'
import axios from 'axios'
import styles from './HomeCategories.style'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MainPageProduct from '../../components/MainPageProduct'
import SortProduct from '../../components/SortProduct'


const HomeCategories = ({route, navigation}) => {

    const {url} = route.params
    const [page, setPage] = useState(0)
    const [data, setData] = useState([])
    const [img, setImg] = useState("")
    const [sortType, setSortType] = useState('')



    const fetchHomeProducts = async() => {
        axios.defaults.headers['X-API-KEY'] = Config.API_KEY
        try {
            const responseData = await axios.post(Config.API_POST_HOME_CATEGORIES_URL, 
                {url_string: url, per_page: '10', page:  page.toString(), sorting: sortType},
                {
                    headers: axios.defaults.headers['Content-Type'] = 'multipart/form-data'
                })
                //console.log("getUrl servisi sonucu sonucu: ",responseData.data)
                setData([...data, ...responseData.data.data])
                setImg(responseData.data.image_path)
                //console.log("fotolar: ",responseData.data.image_path)
        } catch (error) {
            console.log("hata var: ",error)
        }
    }

    useEffect(()=> {
        fetchHomeProducts()
    },[page, sortType])


    const handleSelectedProduct = (id, title) => {
        //console.log(id)
        navigation.navigate('ProductScreen', {id, title})
    }

    const renderProducts = ({item}) => <MainPageProduct 
    item={item} 
    img={img} 
    onSelect={()=> handleSelectedProduct(item.id, item.title)}
    />

    const endReached = () => {
        /*if(page +1 < 5){
            setPage(page+1) 
            fetchHomeProducts()
        }*/
        setPage(page+1)
    }

    const renderLoader = () => {
        return(
            <View>
                <ActivityIndicator size={'large'} color={'#E91E63'}/>
            </View>
        )
    }

    const selectSortASC = () => {
        console.log("artan sıraya göre sıraladım")
        setSortType('ASC')
        fetchHomeProducts()
    }

    const selectSortDESC = () => {
        console.log("azalan sıraya göre sıraladım")
        setSortType('DESC')
        fetchHomeProducts()
    }

    if(route.params.url){
        return(
            <View>
                <SortProduct onSelectASC={selectSortASC} onSelectDESC={selectSortDESC}/>
                <FlatList 
                data={data}
                renderItem={renderProducts}
                onEndReached={endReached}
                numColumns={2}
                ListFooterComponent={renderLoader}
                />
            </View>
        )
    }else{
        return (
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <Text style={{color: '#E91E63', fontWeight: 'bold', fontSize: 18}}>Ürün Bulunamadı!</Text>
            </View>
        )
    }
}

export default HomeCategories