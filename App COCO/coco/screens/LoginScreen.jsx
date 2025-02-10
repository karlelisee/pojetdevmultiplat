import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import RegisterScreen from "./RegisterScreen";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez entrer un email et un mot de passe.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Connexion réussie !");
      navigation.replace("Home"); // Redirige vers la page principale
    } catch (error) {
      console.error("Erreur Firebase:", error);
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Connexion</Text>
      <TextInput 
        placeholder="Email" 
        onChangeText={setEmail} 
        value={email} 
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} 
      />
      <TextInput 
        placeholder="Mot de passe" 
        secureTextEntry 
        onChangeText={setPassword} 
        value={password} 
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} 
      />
      <Button title="Se connecter" onPress={handleLogin} />
      <Button title="Créer un compte" onPress={() => navigation.navigate(RegisterScreen)} />
    </View>
  );
}
