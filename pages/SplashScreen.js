import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import i18n from "./i18n";

const SplashScreen = ({ navigation }) => {
  const [showLangModal, setShowLangModal] = useState(true);
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    if (!showLangModal) {
      const timer = setTimeout(() => {
        navigation.replace("Onboarding");
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [showLangModal]);

  const selectLanguage = (lang) => {
    i18n.locale = lang;
    setLocale(lang);
    setShowLangModal(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo_ravelo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.tagline}>
        Discover Flavors Around You,{'\n'} One Bite at a Time
      </Text>

      <Modal visible={showLangModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{i18n.t("chooseLanguage")}</Text>

            <TouchableOpacity
              style={styles.langOption}
              onPress={() => selectLanguage("id")}
            >
              <Text style={styles.langText}>🇮🇩 {i18n.t("bahasaIndo")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.langOption}
              onPress={() => selectLanguage("en")}
            >
              <Text style={styles.langText}>🇺🇸 {i18n.t("bahasaEng")}</Text>
            </TouchableOpacity>

            {/* Jika ingin tombol batal */}
            {/* 
            <TouchableOpacity onPress={() => setShowLangModal(false)}>
              <Text style={styles.cancelText}>❌ {i18n.t('cancelLang')}</Text>
            </TouchableOpacity> 
            */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#911F1B",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 300,
  },
  tagline: {
    position: "absolute",
    bottom: 40,
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "PoppinsMedium",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: 280,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "PoppinsMedium",
  },
  langOption: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  langText: {
    fontSize: 16,
    fontFamily: "PoppinsRegular",
  },
  cancelText: {
    marginTop: 10,
    fontSize: 14,
    color: "red",
    fontFamily: "PoppinsRegular",
  },
});
