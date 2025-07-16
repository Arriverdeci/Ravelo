import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';

const HelpCenterScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [expandedId, setExpandedId] = useState(null);

    const faqItems = [
    { id: 1, question: 'What is an Initial Assessment?', answer: 'An Initial Assessment is the first step to understand your needs and preferences in the app.' },
    { id: 2, question: 'What is the Rewards Feature?', answer: 'The Rewards Feature gives you points for using the app that can be redeemed for discounts.' },
    { id: 3, question: 'How to Use Crumby?', answer: 'Using Crumby is easy! Just log in, search for services, and enjoy personalized recommendations.' },
    { id: 4, question: 'How to Share to Social Media?', answer: 'Go to your profile, tap "Share", and choose the platform to share your activity.' },
    ];

  const ChefMascot = () => (
    <View style={styles.mascotContainer}>
      <Image 
        source={require('../../assets/ilustration.png')} 
        style={styles.mascotImage}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Chef Mascot */}
        <View style={styles.mascotSection}>
          <ChefMascot />
          <Text style={styles.welcomeText}>Is there anything you want to ask?</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqContainer}>
        {faqItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
            <TouchableOpacity
                key={item.id}
                onPress={() => setExpandedId(isExpanded ? null : item.id)}
                activeOpacity={0.8}
            >
                <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <View style={styles.faqArrow}>
                    <Text style={styles.arrowIcon}>{isExpanded ? '−' : '→'}</Text>
                </View>
                </View>
                {isExpanded && (
                <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                </View>
                )}
            </TouchableOpacity>
            );
        })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mascotSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mascotImage: {
    width: 120,
    height: 120,
  },
  welcomeText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    padding: 10,
  },
  searchIcon: {
    fontSize: 18,
    color: '#666',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  categoryButton: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  faqContainer: {
    marginBottom: 30,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  faqQuestion: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  faqArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#911F1B', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default HelpCenterScreen;