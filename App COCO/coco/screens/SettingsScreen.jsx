import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../firebaseConfig";

const db = getFirestore();

export default function SettingsScreen() {
  const user = auth.currentUser;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState(user?.email || "");

  // Charger les infos de l'utilisateur depuis Firebase Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setAge(data.age || "");
      }
    };

    fetchUserData();
  }, [user]);

  // Fonction pour enregistrer les modifications dans Firebase
  const handleSave = async () => {
    if (!user) {
      Alert.alert("Erreur", "Utilisateur non connecté.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { firstName, lastName, age, email }, { merge: true });
      Alert.alert("Succès", "Vos informations ont été mises à jour !");
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      Alert.alert("Erreur", "Impossible de mettre à jour vos informations.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      <TextInput
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Âge"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        editable={false} // Empêcher la modification de l'email
        style={[styles.input, { backgroundColor: "#ddd" }]}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Sauvegarder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  saveButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
