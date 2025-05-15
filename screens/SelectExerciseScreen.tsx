import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  TextInput,
  SafeAreaView
} from 'react-native';
import { Exercise, WorkoutExercise } from '../model/models';

const DEMO_EXERCISES: Exercise[] = [
  { id: 1, name: 'Bench Press', category: 'Chest' },
  { id: 2, name: 'Incline Bench Press', category: 'Chest' },
  { id: 3, name: 'Decline Bench Press', category: 'Chest' },
  { id: 4, name: 'Push-up', category: 'Chest' },
  { id: 5, name: 'Dumbbell Fly', category: 'Chest' },
  { id: 6, name: 'Squat', category: 'Legs' },
  { id: 7, name: 'Leg Press', category: 'Legs' },
  { id: 8, name: 'Leg Extension', category: 'Legs' },
  { id: 9, name: 'Leg Curl', category: 'Legs' },
  { id: 10, name: 'Calf Raise', category: 'Legs' },
  { id: 11, name: 'Deadlift', category: 'Back' },
  { id: 12, name: 'Pull-up', category: 'Back' },
  { id: 13, name: 'Lat Pulldown', category: 'Back' },
  { id: 14, name: 'Barbell Row', category: 'Back' },
  { id: 15, name: 'T-Bar Row', category: 'Back' },
  { id: 16, name: 'Shoulder Press', category: 'Shoulders' },
  { id: 17, name: 'Lateral Raise', category: 'Shoulders' },
  { id: 18, name: 'Front Raise', category: 'Shoulders' },
  { id: 19, name: 'Upright Row', category: 'Shoulders' },
  { id: 20, name: 'Rear Delt Fly', category: 'Shoulders' },
  { id: 21, name: 'Bicep Curl', category: 'Arms' },
  { id: 22, name: 'Hammer Curl', category: 'Arms' },
  { id: 23, name: 'Tricep Extension', category: 'Arms' },
  { id: 24, name: 'Tricep Pushdown', category: 'Arms' },
  { id: 25, name: 'Skull Crusher', category: 'Arms' },
];

export default function ExerciseSelectScreen({ navigation, route }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const currentWorkout = route.params.workout;
  
  // Filter exercises based on search query
  const filteredExercises = searchQuery.trim() 
    ? DEMO_EXERCISES.filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : DEMO_EXERCISES;

  const handleExerciseSelect = (exercise: Exercise) => {
    if (!currentWorkout) {
      console.error('No workout ID provided');
      return;
    }
    
    const workoutExercise: WorkoutExercise = {
      id: 8888, // Temporary ID for demo
      userId: currentWorkout.userID,
      workoutId: currentWorkout.id!,
      exercise: exercise,
      order_index: 0, // Default to 0 for now
    };
    
    navigation.navigate('InputExerciseSet', {
      workoutExercise: workoutExercise, 
      workout: currentWorkout
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Choose Exercise</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.exerciseItem}
            onPress={() => handleExerciseSelect(item)}
          >
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exerciseCategory}>{item.category}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No exercises found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  searchInput: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
  },
  listContent: {
    padding: 10,
    paddingBottom: 50,
  },
  exerciseItem: {
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    borderWidth: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseCategory: {
    fontSize: 14,
    marginTop: 5,
  },
  categoryHeader: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  categoryHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categorySection: {
    marginBottom: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});