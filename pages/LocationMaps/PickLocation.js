import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import i18n from "../i18n";

const PickLocation = ({ route }) => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const getLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(i18n.t("error"), i18n.t("locationRequired"));
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const initialRegion = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setLocation(initialRegion);

        if (route.params?.currentLocation) {
          setSelectedLocation(route.params.currentLocation);
        }
      } catch (error) {
        console.error("Error getting location permission:", error);
        Alert.alert(i18n.t("error"), i18n.t("locationRequired"));
      }
    };

    getLocationPermission();
  }, [route.params?.currentLocation]);

  const handleSelectLocation = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setSelectedLocation(coordinate);
  };

  const handleSaveLocation = () => {
    if (!selectedLocation) {
      Alert.alert(i18n.t("error"), i18n.t("locationRequired"));
      return;
    }

    navigation.navigate("AddRestoran", {
      selectedLocation,
      formData: route.params?.formData,
    });
  };

  const handleCancel = () => {
    navigation.navigate("AddRestoran", {
      formData: route.params?.formData,
    });
  };

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{i18n.t("loadingMap") || "Loading map..."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={location}
        onPress={handleSelectLocation}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title={i18n.t("selectedLocation") || "Selected Location"}
            description={i18n.t("restaurantLocationHint") || "Restaurant will be placed here"}
            pinColor="red"
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        {selectedLocation && (
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesText}>
              {`${i18n.t("selected") || "Selected"}: ${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`}
            </Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>{i18n.t("cancel")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, !selectedLocation && styles.saveButtonDisabled]}
            onPress={handleSaveLocation}
            disabled={!selectedLocation}
          >
            <Text style={styles.saveButtonText}>
              {selectedLocation ? i18n.t("save") : i18n.t("tapToSelectLocation")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PickLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  coordinatesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  coordinatesText: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    color: '#333',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#911F1B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
  },
});
