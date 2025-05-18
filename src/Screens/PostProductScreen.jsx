import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/FirebaseConfig';
import { Picker } from '@react-native-picker/picker';

const PostProductScreen = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    price: '',
    rating: '',
    sellerEmail: '',
    sellerPhone: '',
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'We need access to your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      handleChange('image', uri);
    }
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.category ||
      !form.image ||
      !form.price ||
      !form.rating ||
      !form.sellerEmail ||
      !form.sellerPhone
    ) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(FIRESTORE_DB, 'products'), {
        ...form,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Product posted!');
      setForm({
        name: '',
        description: '',
        category: '',
        image: '',
        price: '',
        rating: '',
        sellerEmail: '',
        sellerPhone: '',
      });
    } catch (err) {
      Alert.alert('Error', 'Could not post product.');
      console.error(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Post New Product</Text>

      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholder="e.g. Sunscreen SPF 50"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={form.description}
        onChangeText={(text) => handleChange('description', text)}
        placeholder="Detailed description"
      />

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={form.category}
        onValueChange={(value) => handleChange('category', value)}
        style={styles.input}
      >
        <Picker.Item label="Select a category" value="" />
        <Picker.Item label="Skincare" value="skincare" />
        <Picker.Item label="Haircare" value="haircare" />
        <Picker.Item label="Bodycare" value="bodycare" />
        <Picker.Item label="Others" value="others" />
      </Picker>

      <Text style={styles.label}>Image</Text>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {form.image ? 'Change Image' : 'Pick Image from Gallery'}
        </Text>
      </TouchableOpacity>
      {form.image ? (
        <Image
          source={{ uri: form.image }}
          style={{ width: '100%', height: 200, borderRadius: 10, marginVertical: 10 }}
        />
      ) : null}

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        style={styles.input}
        value={form.price}
        onChangeText={(text) => handleChange('price', text)}
        keyboardType="decimal-pad"
        placeholder="e.g. 29.99"
      />

      <Text style={styles.label}>Rating (1 - 5)</Text>
      <Picker
        selectedValue={form.rating}
        onValueChange={(value) => handleChange('rating', value)}
        style={styles.input}
      >
        <Picker.Item label="Select rating" value="" />
        {[1, 2, 3, 4, 5].map((rate) => (
          <Picker.Item key={rate} label={`${rate}`} value={`${rate}`} />
        ))}
      </Picker>

      <Text style={styles.label}>Seller Email</Text>
      <TextInput
        style={styles.input}
        value={form.sellerEmail}
        onChangeText={(text) => handleChange('sellerEmail', text)}
        keyboardType="email-address"
        placeholder="seller@example.com"
      />

      <Text style={styles.label}>Seller Phone</Text>
      <TextInput
        style={styles.input}
        value={form.sellerPhone}
        onChangeText={(text) => handleChange('sellerPhone', text)}
        keyboardType="phone-pad"
        placeholder="+1234567890"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Post Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PostProductScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#006666',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageButton: {
    backgroundColor: '#e0f0ef',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#006666',
    fontWeight: '600',
  },
});
