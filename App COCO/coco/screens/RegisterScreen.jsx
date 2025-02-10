import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Succès", "Compte créé !");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Inscription</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />
      <TextInput placeholder="Mot de passe" secureTextEntry onChangeText={setPassword} value={password} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />
      <Button title="S'inscrire" onPress={handleRegister} />
    </View>
  );
}
