import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const HiddenGemsCard = ({ imageSource, distance }) => {
  return (
    <View style={styles.cardContainer}>
      {/* Gambar Utama */}
      <View style={styles.cardImageWrapper}>
        <Image source={imageSource} style={styles.cardImage} />
      </View>

      {/* Badge Jarak */}
      <View style={styles.distanceBadge}>
        <Text style={styles.distanceText}>{distance}</Text>
      </View>
    </View>
  );
};

export default HiddenGemsCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: 100,
    height: 120,
    marginRight: 8,
    position: "relative",
  },
  cardImageWrapper: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  distanceBadge: {
    position: "absolute",
    bottom: 9,
    right: 0,
    backgroundColor: "#E95322",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  distanceText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontFamily: "PoppinsMedium",
  },
});
