import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade-in animation for the image
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
    <Image source={require("../assets/images/hero.jpeg")} style={styles.image} />
      <Text style={styles.title}>Welcome to AudioSnap</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Record")} // Navigate to Record screen
      >
        <Text style={styles.buttonText}>Start Recording</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 100, // Optional: makes the image circular
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#78b3ce",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#78b3ce",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "60%",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
