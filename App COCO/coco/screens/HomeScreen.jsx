import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, Alert, TextInput, FlatList, TouchableOpacity, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useAuth } from "../config/AuthContext";
import axios from "axios";

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [showPriceBox, setShowPriceBox] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
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

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des suggestions :", error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeoutId); 
  }, [searchQuery]);

  const getRoute = async (destinationCoords) => {
    if (!location || !destinationCoords) return;

    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${location.longitude},${location.latitude};${destinationCoords.longitude},${destinationCoords.latitude}?geometries=geojson&overview=full`
      );

      if (response.data.routes.length > 0) {
        const routeCoordinates = response.data.routes[0].geometry.coordinates.map(([lon, lat]) => ({
          latitude: lat,
          longitude: lon,
        }));

        setRoute(routeCoordinates);

        const distanceInKm = response.data.routes[0].distance / 1000;
        const estimatedPrice = Math.max(2, distanceInKm * 0.6); 
        setPriceEstimate(estimatedPrice.toFixed(2));
        setShowPriceBox(true);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de calculer l'itinéraire.");
    }
  };

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
                latitude: 48.8566,
                longitude: 2.3522,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
        }
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {location && <Marker coordinate={location} title="Vous êtes ici" pinColor="blue" />}
        {destination && <Marker coordinate={destination} title="Destination" pinColor="red" />}
        {route.length > 0 && <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />}
      </MapView>

      
      {showPriceBox && priceEstimate && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Prix estimé: {priceEstimate}€</Text>
          <TouchableOpacity style={styles.taxiButton} onPress={() => Alert.alert("Taxi commandé !")}>
            <Text style={styles.taxiButtonText}>Commander un taxi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowPriceBox(false)}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un lieu..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.place_id.toString()}
            style={styles.searchResults}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => {
                  const coords = {
                    latitude: parseFloat(item.lat),
                    longitude: parseFloat(item.lon),
                  };
                  setDestination(coords);
                  getRoute(coords);
                  setSearchResults([]);
                  setSearchQuery(""); 
                }}
              >
                <Text>{item.display_name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Se déconnecter" onPress={logout} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#fff",
  },
  searchResults: {
    backgroundColor: "#fff",
    maxHeight: 200,
    borderRadius: 5,
    marginTop: 5,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
  },
  infoBox: {
    position: "absolute",
    bottom: 160,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taxiButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  taxiButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginLeft: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
  },
});

export default HomeScreen;
