import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const SectionTitle = ({ title }) => (
  <Animatable.View animation="fadeInLeft" duration={700}>
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.line} />
    </View>
  </Animatable.View>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginTop: 20, marginBottom: 10 },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#006666',
  },
  line: {
    width: 45,
    height: 3,
    backgroundColor: '#6BA292',
    marginTop: 4,
    borderRadius: 2,
  },
});

export default SectionTitle;
