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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    handleChange('category', categoryValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryValue]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: undefined }); // clear error on change
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name || form.name.trim().length < 2) {
      newErrors.name = 'Product name is required (min 2 characters).';
    }
    if (!form.description || form.description.trim().length < 10) {
      newErrors.description = 'Description is required (min 10 characters).';
    }
    if (!form.category) {
      newErrors.category = 'Category is required.';
    }
    if (!form.image) {
      newErrors.image = 'Product image is required.';
    }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = 'Enter a valid positive price.';
    }
    if (!form.sellerEmail || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.sellerEmail)) {
      newErrors.sellerEmail = 'Enter a valid email address.';
    }
    if (
      !form.sellerPhone ||
      !/^(\+?\d{7,15})$/.test(form.sellerPhone.replace(/\s/g, ''))
    ) {
      newErrors.sellerPhone = 'Enter a valid phone number (7-15 digits, can start with +).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // User cancelled image picker
      } else if (response.errorCode) {
        Alert.alert('ImagePicker Error', response.errorMessage || 'Unknown error');
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
    if (!validate()) {
      Alert.alert('Invalid Input', 'Please correct the highlighted errors.');
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
        style={[styles.input, errors.name && styles.inputError]}
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholder="e.g. Sunscreen SPF 50"
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }, errors.description && styles.inputError]}
        multiline
        value={form.description}
        onChangeText={(text) => handleChange('description', text)}
        placeholder="Detailed description"
      />
      {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

      <Text style={styles.label}>Category</Text>
      <DropDownPicker
        open={categoryOpen}
        value={categoryValue}
        items={categoryItems}
        setOpen={setCategoryOpen}
        setValue={setCategoryValue}
        setItems={setCategoryItems}
        placeholder="Select a category"
        style={[styles.input, errors.category && styles.inputError]}
        dropDownContainerStyle={{ borderColor: '#ccc' }}
      />
      {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

      <Text style={styles.label}>Image</Text>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {form.image ? 'Change Image' : 'Pick Image from Gallery'}
        </Text>
      </TouchableOpacity>
      {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
      {form.image ? (
        <Image
          source={{ uri: form.image }}
          style={{ width: '100%', height: 200, borderRadius: 10, marginVertical: 10 }}
        />
      ) : null}

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        style={[styles.input, errors.price && styles.inputError]}
        value={form.price}
        onChangeText={(text) => handleChange('price', text)}
        keyboardType="decimal-pad"
        placeholder="e.g. 29.99"
      />
      {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

      <Text style={styles.label}>Seller Email</Text>
      <TextInput
        style={[styles.input, errors.sellerEmail && styles.inputError]}
        value={form.sellerEmail}
        onChangeText={(text) => handleChange('sellerEmail', text)}
        keyboardType="email-address"
        placeholder="seller@example.com"
      />
      {errors.sellerEmail && <Text style={styles.errorText}>{errors.sellerEmail}</Text>}

      <Text style={styles.label}>Seller Phone</Text>
      <TextInput
        style={[styles.input, errors.sellerPhone && styles.inputError]}
        value={form.sellerPhone}
        onChangeText={(text) => handleChange('sellerPhone', text)}
        keyboardType="phone-pad"
        placeholder="+1234567890"
      />
      {errors.sellerPhone && <Text style={styles.errorText}>{errors.sellerPhone}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
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
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#E57373',
    backgroundColor: '#fff3f3',
  },
  errorText: {
    color: '#E57373',
    fontSize: 13,
    marginBottom: 7,
    marginLeft: 2,
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