import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const HomePage = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logo_atas_ravelo.png")}
          style={styles.logo}
        />
        <View style={{ flex: 1 }} />
        <Image
          source={require("../assets/profile.png")}
          style={styles.profileIcon}
        />
        <View style={styles.notifContainer}>
          <Image
            source={require("../assets/ic_notif.png")}
            style={styles.notifIcon}
          />
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchFilter}>
        <View style={styles.searchBar}>
          <Image
            source={require("../assets/ic_search.png")}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Food/Restaurant"
            placeholderTextColor="#9E9E9E"
          />
        </View>
        <View style={styles.filterButton}>
          <Image
            source={require("../assets/ic_filter.png")}
            style={styles.filterIcon}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent}>
        {/* Category */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {/* CATEGORY ITEM */}
            {[
              { name: "Food", icon: require("../assets/ic_food.png") },
              { name: "Drink", icon: require("../assets/ic_drinks.png") },
              { name: "Dessert", icon: require("../assets/ic_desserts.png") },
              { name: "Snack", icon: require("../assets/ic_snacks.png") },
              { name: "Coffee", icon: require("../assets/ic_coffee.png") },
            ].map((item, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryIconContainer}>
                  <Image
                    source={item.icon}
                    style={styles.categoryIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.categoryLabel}>{item.name}</Text>
              </View>
            ))}

          </ScrollView>
          <View style={styles.categoryUnderline} />
        </View>

        {/* Hidden Gems */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hidden Gems</Text>
            <TouchableOpacity style={styles.viewAll}>
              <Text style={styles.viewAllText}>View All</Text>
              <Image
                source={require("../assets/ic_right_arrow.png")}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>

          {/* TODO: Replace with FlatList for Hidden Gems */}
          <View style={styles.placeholderBox} />
        </View>

        {/* Promotion Card */}
        <View style={styles.section}>
          <View style={styles.promoCard}>
            <View style={styles.promoTextBox}>
              <Text style={styles.promoText}>Make the 10-minute trip</Text>
            </View>
            <Image
              source={require("../assets/pizza.jpg")}
              style={styles.promoImage}
            />
          </View>
          <View style={styles.dotContainer}>
            <View style={styles.dotActive} />
            <View style={styles.dotInactive} />
            <View style={styles.dotInactive} />
          </View>
        </View>

        {/* For Your Taste */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>For Your Taste Buds</Text>
            <TouchableOpacity style={styles.viewAll}>
              <Text style={styles.viewAllText}>View All</Text>
              <Image
                source={require("../assets/ic_right_arrow.png")}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>

          {/* TODO: Replace with FlatList for "For Your Taste" */}
          <View style={styles.placeholderBox} />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#911F1B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 24,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  logo: {
    width: 150,
    height: 55,
    resizeMode: "contain",
  },
  profileIcon: {
    width: 47,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
  },
  notifContainer: {
    width: 48,
    height: 42,
    backgroundColor: "#E6020B",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  notifIcon: {
    width: 20,
    height: 20,
    tintColor: "white",
  },
  searchFilter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  searchBar: {
    flex: 1,
    height: 37,
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: "#000",
    fontFamily: "PoppinsLight",
    fontSize: 14,
  },
  filterButton: {
    width: 47,
    height: 40,
    backgroundColor: "#E6020B",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
  scrollContent: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
  },
  section: {
    marginBottom: 20,
    // paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#000",
    fontFamily: "PoppinsMedium",
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    color: "#911F1B",
    fontSize: 11,
    fontFamily: "PoppinsRegular",
  },
  arrowIcon: {
    width: 6,
    height: 10,
    marginLeft: 8,
    tintColor: "#911F1B",
  },
  promoCard: {
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    height: 120,
    backgroundColor: "#911F1B",
    marginHorizontal: 16,
  },
  promoTextBox: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  promoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  promoImage: {
    flex: 1,
    height: "100%",
    resizeMode: "cover",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#911F1B",
    marginHorizontal: 2,
  },
  dotInactive: {
    width: 20,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#F3E9B5",
    marginHorizontal: 2,
  },
  placeholderBox: {
    height: 100,
    backgroundColor: "#F3F3F3",
    borderRadius: 8,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 3,
    marginHorizontal: 16,
  },
  categoryIconContainer: {
    width: 60,
    height: 75,
    backgroundColor: "#911F1B",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    padding: 17,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    tintColor: "#FFFFFF",
  },
  categoryLabel: {
    fontSize: 12,
    color: "#000000",
    fontFamily: "PoppinsRegular",
    marginTop: 4,
  },
  categoryUnderline: {
    height: 1.5,
    backgroundColor: "#911F1B",
    marginTop: 10,
    marginHorizontal: 16,
  },


});
