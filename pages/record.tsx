import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore"; 

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAin7_KWg0j_9y8wuWLJYXjr-KA04-JVbo",
  authDomain: "audio-app-1822f.firebaseapp.com",
  projectId: "audio-app-1822f",
  storageBucket: "audio-app-1822f.appspot.com",
  messagingSenderId: "666347620412",
  appId: "1:666347620412:web:2f118643b46a6f1efa9b39",
  measurementId: "G-1956JGPZSN",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const AudioRecorderApp = ( { route }: { route: any } ) => {
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRecordings();
    requestPermission();

    return () => {
      if (recording) {
        stopRecording();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const requestPermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access microphone is required!');
    }
  };

  const fetchRecordings = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'recordings'));
      const fetchedRecordings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecordings(fetchedRecordings);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    }
  };

  const addRecordingToFirestore = async (newRecording) => {
    try {
      const docRef = await addDoc(collection(firestore, 'recordings'), newRecording);
      setRecordings(prevRecordings => [
        ...prevRecordings,
        { id: docRef.id, ...newRecording },
      ]);
    } catch (error) {
      console.error('Error saving recording:', error);
    }
  };

  const updateRecordingName = async (id, newName) => {
    try {
      const docRef = doc(firestore, 'recordings', id);
      await updateDoc(docRef, { name: newName });
      setRecordings(prevRecordings =>
        prevRecordings.map(recording =>
          recording.id === id ? { ...recording, name: newName } : recording
        )
      );
    } catch (error) {
      console.error('Error updating recording name:', error);
    }
  };

  const deleteRecording = async (id) => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, 'recordings', id));
              setRecordings(prevRecordings =>
                prevRecordings.filter(recording => recording.id !== id)
              );
            } catch (error) {
              console.error('Error deleting recording:', error);
            }
          },
        },
      ]
    );
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      setRecording(null);
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      const newRecording = {
        uri,
        name: `Recording ${Date.now()}`,
        date: new Date().toLocaleString(),
      };

      await addRecordingToFirestore(newRecording);
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const playRecording = async (uri) => {
    try {
      if (currentlyPlaying) {
        await currentlyPlaying.stopAsync();
        await currentlyPlaying.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      setCurrentlyPlaying(newSound);

      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) {
          setCurrentlyPlaying(null);
        }
      });
    } catch (error) {
      console.error('Error playing recording:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.recordingItem}>
      <View style={styles.recordingInfo}>
        <Text style={styles.recordingDate}>{item.date}</Text>
        <Text style={styles.recordingName}>{item.name}</Text>
      </View>
      <View style={styles.recordingControls}>
        <TouchableOpacity
          onPress={() => playRecording(item.uri)}
          style={styles.controlButton}
        >
          <MaterialIcons name="play-arrow" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setEditingId(item.id);
            setEditingName(item.name);
            setIsModalVisible(true);
          }}
          style={styles.controlButton}
        >
          <MaterialIcons name="edit" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteRecording(item.id)}
          style={styles.controlButton}
        >
          <MaterialIcons name="delete" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleEditSubmit = () => {
    updateRecordingName(editingId, editingName);
    setIsModalVisible(false);
    setEditingName('');
    setEditingId(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AudioSnap</Text>
      </View>

      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No recordings yet</Text>
        )}
      />

      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recordingButton]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <MaterialIcons
          name={isRecording ? 'stop' : 'mic'}
          size={32}
          color="white"
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Recording Name</Text>
            <TextInput
              value={editingName}
              onChangeText={setEditingName}
              style={styles.textInput}
            />
            <TouchableOpacity onPress={handleEditSubmit} style={styles.submitButton}>
              <Text style={styles.submitText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#78b3ce',
    padding: 26,
  },
  header: {
    padding: 26,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'center',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  recordingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingDate: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginLeft: 8,
  },
  recordButton: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  emptyText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 22,
    marginTop: 32,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 32,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#78b3ce',
    marginBottom: 32,
  },
  textInput: {
    width: '80%',
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#78b3ce',
    borderRadius: 8,
    shadowColor: '#78b3ce',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  submitButton: {
    width: '80%',
    backgroundColor: '#78b3ce',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  submitText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default AudioRecorderApp;