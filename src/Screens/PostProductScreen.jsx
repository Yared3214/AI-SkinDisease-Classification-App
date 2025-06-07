import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const CLOUD_NAME = 'dfnzk8ip2';
const UPLOAD_PRESET = 'educational_resources';

const PostProductScreen = () => {
  const navigation = useNavigation();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryItems, setCategoryItems] = useState([
    { label: 'Skincare', value: 'skincare' },
    { label: 'Haircare', value: 'haircare' },
    { label: 'Bodycare', value: 'bodycare' },
    { label: 'Others', value: 'others' },
  ]);
  const [categoryValue, setCategoryValue] = useState('skincare');
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

  useEffect(() => {
  handleChange('category', categoryValue);
}, [categoryValue]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const pickImage = () => {
      const options = {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
      };
  
      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          handleChange('image', uri);
        }
      });
    };
  
    // Upload Image to Cloudinary
    const uploadImageToCloudinary = async (imageUri) => {
      try {
        const data = new FormData();
        data.append('file', { uri: imageUri, type: 'image/jpeg', name: 'upload.jpg' });
        data.append('upload_preset', UPLOAD_PRESET);
        data.append('cloud_name', CLOUD_NAME);
  
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          data,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
  
        return response.data.secure_url;
      } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return null;
      }
    };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.category ||
      !form.image ||
      !form.price ||
      !form.sellerEmail ||
      !form.sellerPhone
    ) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(form.image);
          if (!imageUrl) {
            throw new Error('Image upload failed.');
          }
      await firestore().collection('products').add({
      ...form,
      image: imageUrl, // 🔄 use uploaded URL
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
      Alert.alert('Success', 'Product posted!');
      setForm({
        name: '',
        description: '',
        category: '',
        image: imageUrl,
        price: '',
        rating: '',
        sellerEmail: '',
        sellerPhone: '',
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Could not post product.');
      console.error(err);
    } finally {
      setLoading(false);
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
      <DropDownPicker
        open={categoryOpen}
        value={categoryValue}
        items={categoryItems}
        setOpen={setCategoryOpen}
        setValue={setCategoryValue}
        setItems={setCategoryItems}
        placeholder="Select a category"
        style={styles.input}
        dropDownContainerStyle={{ borderColor: '#ccc' }}
      />

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
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Post Product</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PostProductScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#F4FAFA',
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
