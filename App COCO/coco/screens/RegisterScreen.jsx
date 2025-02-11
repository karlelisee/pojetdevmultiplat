import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez entrer un email et un mot de passe.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Utilisateur créé:", userCredential.user);
      Alert.alert("Succès", "Compte créé !");
      navigation.replace("Login"); // Redirige vers la connexion
    } catch (error) {
      console.error("Erreur Firebase:", error);
      Alert.alert("Erreur", "Cet email est déjà utilisé.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      {/*<Image source={require("../assets/logo.png")} style={styles.logo} />*/}

      <Text style={styles.title}>Créer un compte</Text>
      <Text style={styles.subtitle}>Rejoignez-nous dès maintenant !</Text>

      {/* Champs de saisie */}
      <TextInput 
        placeholder="Email" 
        onChangeText={setEmail} 
        value={email} 
        keyboardType="email-address"
        style={styles.input} 
      />
      <TextInput 
        placeholder="Mot de passe" 
        secureTextEntry 
        onChangeText={setPassword} 
        value={password} 
        style={styles.input} 
      />

      {/* Bouton d'inscription */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>S'inscrire</Text>
      </TouchableOpacity>

      {/* Redirection vers la connexion */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingLeft: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 20,
    color: "#007bff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

