import React, { useState } from 'react'
import { Alert, Image, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import styles from './ChangePassword.style'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Config from 'react-native-config'
import axios from 'axios'

const ChangePassword = ({navigation}) => {

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const changePassword = async() => {
        axios.defaults.headers['X-API-KEY'] = Config.API_KEY
        console.log("eski şifre: ", oldPassword)
        console.log("yeni şifre: ", newPassword)
        const responseData = await axios.post(Config.API_POST_CHANGE_PASSWORD_URL, {old_password: oldPassword, new_password: newPassword},
        {
            headers: axios.defaults.headers['Content-Type'] = 'multipart/form-data'
        })
        console.log("post işlem sonucu: ",responseData.data)
        console.log("eski şifre: ", oldPassword)
        console.log("yeni şifre: ", newPassword)
        if(responseData.data.status === "success"){
            Alert.alert('Şifre Değişimi Başarılı','Şifreniz başarıyla değiştirildi lütfen yeni şifrenizle giriş yapınız',[
                {text: 'Tamam', onPress: () => navigation.navigate('LogInScreen')},
            ])
        }else{
            Alert.alert('Hatalı İşlem',responseData.data.message,[
                {text: 'Tamam', onPress: () => {
                    setNewPassword("")
                    setOldPassword("")
                }},
            ])
        }
    }

    return(
        <View style={styles.container}>
            <Image source = {require('../../../assets/narlogo.png')} style={styles.image}/>
            <View style={styles.inner_container}>
                <Icon name={'account-key-outline'} style={styles.icon}/>
                <TextInput placeholder='Eski Şifre' onChangeText={setOldPassword} value={oldPassword} style={styles.input} placeholderTextColor={'gray'} cursorColor={'#E91E63'}/>
            </View>
            <View style={styles.inner_container}>
                <Icon name={'account-key'} style={styles.icon}/>
                <TextInput placeholder='Yeni Şifre' onChangeText={setNewPassword} value={newPassword} style={styles.input} placeholderTextColor={'gray'} cursorColor={'#E91E63'}/>
            </View>
            <TouchableWithoutFeedback onPress={changePassword} >
                <View style={styles.button}>
                    <Text style={{color: 'white'}}>Şifreyi Değiştir</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default ChangePassword