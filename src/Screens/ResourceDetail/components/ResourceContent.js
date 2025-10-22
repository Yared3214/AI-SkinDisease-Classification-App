// components/resource/ResourceContent.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Linking } from 'react-native';
import RenderHtml from 'react-native-render-html';

const ResourceContent = ({ description, document }) => {
  const width = Dimensions.get('window').width;
  return (
    <View>
      <RenderHtml contentWidth={width} source={{ html: description }} />
      {document && (
        <>
          <Text style={styles.label}>Article Document:</Text>
          <TouchableOpacity onPress={() => Linking.openURL(document)}>
            <Text style={styles.link}>View Article Content</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 15, fontWeight: '600', color: '#444', marginTop: 10 },
  link: {
    fontSize: 15,
    color: '#006666',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});

export default ResourceContent;
