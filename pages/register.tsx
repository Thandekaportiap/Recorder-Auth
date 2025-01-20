import React, { useState } from 'react';
import { TextInput, Button, View, Text, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase'; // Assuming you have firestore initialized in your firebase config
import { doc, setDoc } from 'firebase/firestore';

const Register = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState('');
  const [Username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      // Register the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // After registration, save the user details in Firestore
      const userRef = doc(firestore, 'users', userCredential.user.uid); // Create a reference to a document in 'users' collection
      await setDoc(userRef, {
        name: name,
        username: Username,
        email: email,
      });

      // Navigate to the 'Record' screen after successful registration and data storage
      navigation.navigate('Record'); 
    } catch (error) {
      console.log(error);
      alert('Registration failed!');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fbf8ef', padding: 14, margin: 28 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#78b3ce', marginBottom: 32 }}>Create New Account!</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
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
        placeholder="Username"
        value={Username}
        onChangeText={setUsername}
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
      <TouchableOpacity
        style={{
          width: '80%',
          backgroundColor: '#78b3ce',
          borderRadius: 8,
          paddingVertical: 12,
          marginBottom: 24
        }}
        onPress={handleRegister}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Register</Text>
      </TouchableOpacity>
      <Text
        onPress={() => navigation.navigate('Login')}
        style={{ color: '#78b3ce', textDecorationLine: 'underline', textAlign: 'center' }}
      >
        Already have an account? Login
      </Text>
    </View>
  );
};

export default Register;
