import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Exercise } from '../model/model';

const mockExercises: Exercise[] = [
  { id: 1, name: 'Bench Press', category: 'Chest' },
  { id: 2, name: 'Deadlift', category: 'Back' },
  { id: 3, name: 'Squat', category: 'Legs' },
];

export default function ExerciseSelectScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose an Exercise</Text>
      <FlatList
        data={mockExercises}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.exerciseItem}
            onPress={() => navigation.navigate('ExerciseSet', { exercise: item })}
          >
            <Text>{item.name} ({item.category})</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  exerciseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  }
});
