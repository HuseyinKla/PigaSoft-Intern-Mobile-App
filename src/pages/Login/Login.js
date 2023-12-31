import React, { useEffect, useState } from 'react'
import { Text, View, Image, TextInput,TouchableWithoutFeedback, Alert  } from 'react-native'
import {Formik} from 'formik'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from './Login.style'
import Config from 'react-native-config'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'




const Login = ({navigation}) => {

    const [data, setData] = useState([])

    const handleLogin = async(values) =>{
        axios.defaults.headers['X-API-KEY'] = Config.API_KEY
        console.log("login verileri: ",values)
        try {
            const responseData = await axios.post(Config.API_POST_LOGIN,values,
            {
                headers: axios.defaults.headers['Content-Type'] = 'multipart/form-data'
            })
            setData(responseData)
            console.log("login işlemi sonucu: ",responseData.data.status)
            if(responseData.data.status === "error"){
                Alert.alert('Narevim', 'Şifreniz veya e-postanız yanlış! Lütfen doğru giriniz', [
                    {text: 'Tamam', onPress: () => console.log('Tamam tıklandı')},
                ])
            }else{
                console.log(values)
                AsyncStorage.setItem('USER', JSON.stringify(values))
                //navigation.replace('AccountScreen')
                navigation.navigate('AccountScreen')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchMemberInfo = async () => {
        axios.defaults.headers['X-API-KEY'] = Config.API_KEY
        AsyncStorage.getItem('USER')
        .then(async userSession => {
            console.log("otomatik giriş ile gelen bilgiler: ", JSON.parse(userSession))
            if(userSession){
                const {email, password} = JSON.parse(userSession)
                const responseData = await axios.post(Config.API_POST_LOGIN, {email: email, password: password},
                {
                    headers: axios.defaults.headers['Content-Type'] = 'multipart/form-data'
                })
                console.log("otomatik login olma işlem sonucu: ",responseData.data)
                if(responseData.data.status === "success"){
                    navigation.navigate('AccountScreen')
                }
            }
        })
        .catch(err=> console.log("useEffect ile bilgi getirirken hata aldım: ",err))
    }

    useEffect(()=> {
        fetchMemberInfo()
    },[])


    const signinPress = () => {
        navigation.navigate('SignInScreen')
    }

    const textPress = () => {
        navigation.navigate('ForgotPasswordScreen')
    }

    return(
        <View style={styles.container}>
            <Image source = {require('../../assets/narlogo.png')} style={styles.image}/>
            <Formik
            initialValues={{email: '', password: ''}}
            onSubmit={(values)=> handleLogin(values)}>
            {({handleSubmit, handleChange, values}) => (
                <View>
                    <View style={styles.inner_container}>
                        <Icon name="account" size={30} style={styles.icon}/>
                        <TextInput style={styles.input} 
                        placeholder='E-Posta' 
                        placeholderTextColor={'gray'}
                        cursorColor={'#E91E63'}
                        keyboardType='email-address'
                        value={values.email} 
                        onChangeText={handleChange('email')}/>
                    </View>
                    <View style={styles.inner_container}>
                        <Icon name="key-variant" size={30} style={styles.icon}/>
                        <TextInput style={styles.input} 
                        placeholder='Şifre' 
                        cursorColor={'#E91E63'}
                        value={values.password}
                        placeholderTextColor={'gray'}
                        onChangeText={handleChange('password')}
                        secureTextEntry/>
                    </View>
                    <TouchableWithoutFeedback onPress={handleSubmit}>
                        <View style={styles.button_login}>
                        <Text style={styles.login_title}>Giriş Yap</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )}
            </Formik>
            <TouchableWithoutFeedback onPress={signinPress}>
                <View style={styles.button_signin}>
                    <Text style={styles.signin_title}>Kayıt Ol</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={textPress}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Şifremi unuttum</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}


export default Login