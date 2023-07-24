import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Text, View, Image, Button, TextInput } from 'react-native'
import Config from 'react-native-config'
import useFetchCategories from '../../hooks/useFetchCategories'
import { SafeAreaView } from 'react-native-safe-area-context'
import MainPageCategoriesCard from '../../components/MainPageCategoriesCard/MainPageCategoriesCard'
import styles from './Home.style'

import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount } from '../../context/counter/counterSlice'
import { addAddress } from '../../context/AddressList/addressSlice'


const Home = ({navigation}) => {

  const count = useSelector(state => state.counter.value)
  const dispatch = useDispatch()
  const adres = useSelector(state => state.address.addressList)


  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")
  const [text3, setText3] = useState("")

  console.log(adres)

  const {data, loading, error} = useFetchCategories(Config.API_GET_MAIN_CATEGORIES_URL)
    
  const renderMainCategories = ({item}) => <MainPageCategoriesCard category={item} 
  onSelect={() => handleSelectMainCategories(item.button_url)} 
  imageUrl={data.image_path}/>


  const renderAddressitem = ({item}) => {
  return(
    <Text>{item.name}</Text>
  )}

  const handleSelectMainCategories = (url) => {
    console.log(url)
    navigation.navigate('HomeScreencategories', {url} )
  }


  const casualData = [
  {
    id: 0,
    name: 'isim1',
    surname: 'soyisim1',
    age: 'yaş1',
  },
  {
    id: 1,
    name: 'isim2',
    surname: 'soyisim2',
    age: 'yaş2',
  },
  {
    id: 2,
    name: 'isim3',
    surname: 'soyisim3',
    age: 'yaş3',
  },
  {
    id: 3,
    name: 'isim4',
    surname: 'soyisim4',
    age: 'yaş4',
  },
]

const tempcasualData = [
    'isim1',
    'soyisim1',
    'yaş1',
    'isim2',
    'soyisim2',
    'yaş2',
    'isim3',
    'soyisim3',
    'yaş3',
    'isim4',
    'soyisim4',
    'yaş4',
]

  if(error){
    console.log("işlem hatalı error: ",error)
  }
  if(loading){
    return <ActivityIndicator size={'large'}/>
  }else{
    return(
      <SafeAreaView>
        <Image source = {require('../../assets/narlogo.png')} style={styles.image}/>
        <Button title='arttır' onPress={()=> dispatch(increment())}></Button>
        <Button title='azalt' onPress={()=> dispatch(decrement())}></Button>
        <Button title='tam arttır' onPress={()=> dispatch(incrementByAmount(10))}></Button>
        <Text>{count}</Text>
        <TextInput value={text1} onChangeText={setText1} placeholder='bişyler gir'/>
        <TextInput value={text2} onChangeText={setText2} placeholder='bişyler gir'/>
        <TextInput value={text3} onChangeText={setText3} placeholder='bişyler gir'/>
        <Button title='girişi sonlandır' onPress={()=> dispatch(addAddress({text1,text2,text3}))}/>
        <FlatList data={casualData} renderAddress={renderAddressitem}/>
        <FlatList data={data.data} renderItem={renderMainCategories}/>
      </SafeAreaView>
    )
  }
}

export default Home

//
//