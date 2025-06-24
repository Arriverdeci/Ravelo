import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

const PickLocation = ({ route }) => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const getLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Location access is required.");
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
          // console.log("Setting current location from params:", route.params.currentLocation);
          setSelectedLocation(route.params.currentLocation);
        }
        
      } catch (error) {
        console.error("Error getting location permission:", error);
        // Alert.alert("Error", "Failed to get current location");
      }
    };

    getLocationPermission();
  }, [route.params?.currentLocation]);

  const handleSelectLocation = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    // console.log("Location selected:", coordinate);
    setSelectedLocation(coordinate);
  };

  const handleSaveLocation = () => {
    if (!selectedLocation) {
      Alert.alert("No location selected", "Please tap on the map to select a location.");
      return;
    }

    // console.log("Saving location and navigating back with:", {
    //   selectedLocation,
    //   formData: route.params?.formData
    // });

    navigation.navigate("AddRestoran", {
      selectedLocation,
      formData: route.params?.formData
    });
  };

  const handleCancel = () => {
    navigation.navigate("AddRestoran", {
      formData: route.params?.formData
    });
  };

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading map...</Text>
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
            title="Selected Location"
            description="Restaurant will be placed here"
            pinColor="red"
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        {selectedLocation && (
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesText}>
              Selected: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
            </Text>
          </View>
        )}
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              !selectedLocation && styles.saveButtonDisabled
            ]} 
            onPress={handleSaveLocation}
            disabled={!selectedLocation}
          >
            <Text style={styles.saveButtonText}>
              {selectedLocation ? 'Save Location' : 'Select Location'}
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
