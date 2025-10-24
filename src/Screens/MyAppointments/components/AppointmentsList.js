import React from 'react';
import { FlatList } from 'react-native';
import AppointmentCard from './AppointmentCard';

export default function AppointmentsList({ data, onCancel, cancellingId }) {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingBottom: 40 }}
      renderItem={({ item }) => (
        <AppointmentCard
          item={item}
          onCancel={onCancel}
          cancellingId={cancellingId}
        />
      )}
    />
  );
}
