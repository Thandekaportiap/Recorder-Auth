// Login.tsx
import React, { useState } from 'react';
import { TextInput, Button, View, Text, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';


const Login = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Record'); // Navigate to the Record screen after login
    } catch (error) {
      console.log(error);
      alert('Login failed!');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fbf8ef', padding: 14, margin: 28 }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#78b3ce', marginBottom: 32 }}>Welcome Back!</Text>

  <TextInput
    placeholder="Email"
    value={email}
    onChangeText={setEmail}
    style={{
      width: '80%',
      padding: 16,
      marginBottom: 20,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#78b3ce',
      borderRadius: 8,
      shadowColor: '#78b3ce',
      shadowOpacity: 0.1,
      shadowRadius: 5
    }}
  />

  <TextInput
    placeholder="Password"
    secureTextEntry
    value={password}
    onChangeText={setPassword}
    style={{
      width: '80%',
      padding: 16,
      marginBottom: 24,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#78b3ce',
      borderRadius: 8,
      shadowColor: '#78b3ce',
      shadowOpacity: 0.1,
      shadowRadius: 5
    }}
  />

  <TouchableOpacity style={{ width: '80%', backgroundColor: '#78b3ce', borderRadius: 8, paddingVertical: 12, marginBottom: 24 }}>
    <Text style={{ color: 'white', textAlign: 'center' }}  onPress={handleLogin} >Login</Text>
  </TouchableOpacity>

  <Text
    onPress={() => navigation.navigate('Register')}
    style={{ marginTop: 24, color: '#78b3ce', textDecorationLine: 'underline', textAlign: 'center' }}
  >
    Don't have an account? Register
  </Text>
</View>

  
  );
};

export default Login;
