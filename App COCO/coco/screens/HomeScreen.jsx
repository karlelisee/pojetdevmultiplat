import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useAuth } from "../config/AuthContext";

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission refusée pour accéder à la localisation.");
        Alert.alert("Erreur", "Permission refusée pour accéder à la localisation.");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : {
                latitude: 48.8566, // Coordonnées par défaut (Paris)
                longitude: 2.3522,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
        }
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Vous êtes ici"
            pinColor="blue"
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Se déconnecter" onPress={logout} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
  },
});

export default HomeScreen;
