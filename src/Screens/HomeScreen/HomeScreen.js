import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import HeaderBanner from './components/HeaderBanner';
import FeatureCard from './components/FeatureCard';
import SectionTitle from './components/SectionTitle';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Animated Header Banner */}
      <Animatable.View animation="fadeInDown" duration={1000}>
        <HeaderBanner />
      </Animatable.View>

      {/* Intro Section */}
      <Animatable.View
        animation="fadeInUp"
        delay={300}
        duration={800}
        style={styles.introSection}
      >
        <Text style={styles.welcomeText}>Welcome to Skin Health Companion</Text>
        <Text style={styles.description}>
          Your trusted partner for skin wellness. Access dermatologist-approved
          resources, upload skin images for smart analysis, and connect securely
          with verified experts.
        </Text>
      </Animatable.View>

      {/* Section Title */}
      <SectionTitle title="What You Can Do" />

      {/* Animated Feature Cards */}
      <View style={styles.cardContainer}>
        <Animatable.View animation="fadeInRight" delay={100} duration={600}>
          <FeatureCard
            title="Analyze Skin ImageSkin Care Products"
            icon="shopping-bag"
            color="#6BA292"
            onPress={() => navigation.navigate('upload')}
            description="Explore recommended skincare products suitable for various skin types,
              backed by dermatological research."
          />
        </Animatable.View>

        <Animatable.View animation="fadeInRight" delay={200} duration={600}>
          <FeatureCard
            title="Educational Resources"
            icon="book-open"
            color="#008CBA"
            onPress={() => navigation.navigate('resources')}
            description="Learn about common skin conditions from verified sources."
          />
        </Animatable.View>

        <Animatable.View animation="fadeInRight" delay={300} duration={600}>
          <FeatureCard
            title="Consult Dermatologist"
            icon="user-check"
            color="#00A676"
            onPress={() => navigation.navigate('experts')}
            description="Connect with certified dermatologists for professional advice."
          />
        </Animatable.View>

        <Animatable.View animation="fadeInRight" delay={400} duration={600}>
          <FeatureCard
            title="Manage My Profile"
            icon="user"
            color="#006666"
            onPress={() => navigation.navigate('profile')}
            description="View or update your personal details and medical history."
          />
        </Animatable.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  introSection: { padding: 20, marginTop: 10 },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#006666',
    marginBottom: 8,
  },
  description: {
    color: '#444',
    fontSize: 15,
    lineHeight: 22,
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingBottom: 50,
    gap: 16,
  },
});

export default HomeScreen;
