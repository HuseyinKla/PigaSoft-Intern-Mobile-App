import React, {useState} from 'react'
import { View, Text, TextInput, TouchableWithoutFeedback, ActivityIndicator, Alert } from 'react-native'
import styles from './Payment.style'
import useFetchCategories from '../../hooks/useFetchCategories/useFetchCategories'
import { Dropdown } from 'react-native-element-dropdown'
import Config from 'react-native-config'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setZero } from '../../context/counter/counterSlice'

const Payment = ({navigation}) => {

    const {data, loading, error} = useFetchCategories(Config.API_GET_CARGO_LIST_URL)
    const dispatch = useDispatch()

    const [isFocus, setIsFocus] = useState(false)
    const [id, setId] = useState('1')

    const [key, setKey] = useState('1')
    const [isFocusPay, setIsFocusPay] = useState(false)

    const [note, setNote] = useState("")
    const [coupon, setCoupon] = useState("")

    console.log(data)

    const paymentTypes = [
        {key:'1', value:'Havale / EFT'},
        {key:'2', value:'Kapıda Ödeme'},
    ]

    const finishPayment = async() => {
        axios.defaults.headers['X-API-KEY'] = Config.API_KEY
        const responseData = await axios.post(Config.API_POST_CREATE_ORDER_URL, {payment_type: key, cargo_id: id, order_note: note},
        {
            headers: axios.defaults.headers['Content-Type'] = 'multipart/form-data'
        })
        console.log("post işlem sonucu: ",responseData.data.status)
        if(responseData.data.status === "error"){
            Alert.alert('Geçersiz İşlem', responseData.data.message,[
                {text: 'Tamam', onPress: () => navigation.navigate('AccountStack', {screen: 'LogInScreen'})},
            ])
        }else{
            Alert.alert('Siparişiniz Alınmıştır', responseData.data.message, [
                {text: 'Tamam', onPress: () => {
                    dispatch(setZero())
                    navigation.navigate('BasketScreen')
                }},
            ])
        }
    }

    const checkCoupon = async() => {
        console.log(coupon)
        axios.defaults.headers['X-API-KEY'] = Config.API_KEY
        const responseData = await axios.post(Config.API_POST_DISCOUNT_COUPON_URL, {discount_code: coupon},
        {
            headers: axios.defaults.headers['Content-Type'] = 'multipart/form-data'
        })
        if(responseData.data.status === "error"){
            Alert.alert('Geçersiz İşlem', responseData.data.message,[
                {text: 'Tamam', onPress: () => setCoupon("")},
            ])
        }else{
            Alert.alert('Kupon Başarıyla Uygulandı Alınmıştır', responseData.data.message, [
                {text: 'Tamam', onPress: () => null},
            ])
        }
    }


    if(loading){
        return(
            <ActivityIndicator size={'large'}/>
        )
    }else{
        return(
            <View style={styles.container}>
                <View style={styles.payment_container}>
                    <Text style={styles.text}>Ödeme Yöntemi Seçin: </Text>
                    <Dropdown
                      style={[styles.dropdown, isFocusPay && { borderColor: '#E91E63' }]}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={{color: 'black'}}
                      data={paymentTypes}
                      maxHeight={300}
                      labelField="value"
                      valueField="key"
                      value={key}
                      onFocus={() => setIsFocusPay(true)}
                      onBlur={() => setIsFocusPay(false)}
                      onChange={item => {
                        setKey(item.key);
                        setIsFocusPay(false);
                      }}
                    />
                </View>
                <View style={styles.cargo_container}>
                    <Text style={styles.text}>Kargo Firması Seçin: </Text>
                    <Dropdown
                      style={[styles.dropdown, isFocus && { borderColor: '#E91E63' }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={{color: 'black'}}
                      data={data.data}
                      search
                      maxHeight={300}
                      labelField="title"
                      valueField="id"
                      placeholder={!isFocus ? 'Şehir Seçin' : '...'}
                      searchPlaceholder="Ara..."
                      value={id}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setId(item.id);
                        setIsFocus(false);
                      }}
                    />
                </View>
                <View style={styles.discount_container}>
                    <Text style={styles.text_bold}>Kupon Kodu Ekle</Text>
                    <View style={{flexDirection: 'row'}}>
                        <TextInput placeholder='Kupon Kodu' style={styles.input} onChangeText={setCoupon} value={coupon} placeholderTextColor={'gray'} cursorColor={'#E91E63'}/>
                        <TouchableWithoutFeedback onPress={checkCoupon}>
                            <View style={styles.button}>
                                <Text style={{color: 'white'}}>Uygula</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={styles.note_container}>
                    <Text style={styles.text_bold}>Eklemek istediğiniz not var mı ?</Text>
                    <TextInput placeholder='Not' style={styles.long_input} value={note} onChangeText={setNote} placeholderTextColor={'gray'} cursorColor={'#E91E63'}/>
                </View>
                <TouchableWithoutFeedback onPress={finishPayment}>
                    <View style={styles.long_button}>
                        <Text style={{color: 'white'}}>Ödeme Ekranı</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

export default Payment
