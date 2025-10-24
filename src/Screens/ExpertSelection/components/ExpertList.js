import React from 'react';
import { FlatList } from 'react-native';
import ExpertCard from './ExpertCard';

const ExpertList = ({ data, navigation }) => (
  <FlatList
    data={data}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <ExpertCard
        expert={item}
        onPress={() => navigation.navigate('time-slot', {
          expertId: item.id,
          expertName: item.name,
        })}
      />
    )}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 40 }}
  />
);

export default ExpertList;
