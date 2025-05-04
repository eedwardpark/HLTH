import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  TextInput,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { DatabaseOperations } from '../db/db';
import { Exercise } from '../model/model';

// Demo data for quick testing without database
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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(true); // Set to false to use real database
  
  const { workoutId, onExerciseAdded } = route.params || { workoutId: 1 }; // Demo workoutId if none provided

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  }, [searchQuery, exercises]);

  const loadExercises = async () => {
    setLoading(true);
    try {
      if (useDemo) {
        // Use demo data for quick testing
        setExercises(DEMO_EXERCISES);
        setFilteredExercises(DEMO_EXERCISES);
        setLoading(false);
      } else {
        // Use actual database
        const exerciseList = await DatabaseOperations.getExercises();
        setExercises(exerciseList);
        setFilteredExercises(exerciseList);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseSelect = async (exercise: Exercise) => {
    if (!workoutId) {
      console.error('No workout ID provided');
      return;
    }

    try {
      if (useDemo) {
        // Demo mode - just navigate to next screen
        console.log(`Selected exercise: ${exercise.name} (${exercise.category})`);
        
        // Navigate directly to the exercise set screen
        navigation.navigate('ExerciseSet', {
          workoutId,
          workoutExerciseId: Math.floor(Math.random() * 1000), // Demo ID
          exerciseName: exercise.name,
          onSetAdded: () => console.log('Set added callback')
        });
      } else {
        // Get current count of exercises in the workout to determine order
        const currentExercises = await DatabaseOperations.getWorkoutExercises(workoutId);
        const orderIndex = currentExercises.length;
        
        // Add the exercise to the workout
        const workoutExerciseId = await DatabaseOperations.addExerciseToWorkout(
          workoutId,
          exercise.id!,
          orderIndex
        );
        
        // Call the callback function if provided
        if (onExerciseAdded) {
          onExerciseAdded();
        }
        
        // Navigate to the exercise set screen
        navigation.navigate('ExerciseSet', {
          workoutId,
          workoutExerciseId,
          exerciseName: exercise.name,
          onSetAdded: onExerciseAdded
        });
      }
    } catch (error) {
      console.error('Error adding exercise to workout:', error);
    }
  };

  const renderCategoryHeader = (category: string) => (
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryHeaderText}>{category}</Text>
    </View>
  );

  const renderExercisesByCategory = () => {
    // Group exercises by category
    const groupedExercises: {[key: string]: Exercise[]} = {};
    
    filteredExercises.forEach(exercise => {
      if (!groupedExercises[exercise.category]) {
        groupedExercises[exercise.category] = [];
      }
      groupedExercises[exercise.category].push(exercise);
    });
    
    // Sort categories alphabetically
    const sortedCategories = Object.keys(groupedExercises).sort();
    
    return (
      <>
        {sortedCategories.map(category => (
          <View key={category} style={styles.categorySection}>
            {renderCategoryHeader(category)}
            {groupedExercises[category].map(exercise => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseItem}
                onPress={() => handleExerciseSelect(exercise)}
              >
                <Text style={styles.exerciseName}>{exercise.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </>
    );
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
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading exercises...</Text>
        </View>
      ) : (
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
      )}

      {/* Demo Mode Indicator */}
      {useDemo && (
        <View style={styles.demoIndicator}>
          <Text style={styles.demoText}>DEMO MODE</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
  },
  listContent: {
    padding: 10,
    paddingBottom: 50, // Extra padding for demo indicator
  },
  exerciseItem: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  exerciseCategory: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  categoryHeader: {
    backgroundColor: '#333',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  categoryHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  categorySection: {
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  demoIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#553333',
    padding: 10,
    alignItems: 'center',
  },
  demoText: {
    color: '#ff9999',
    fontWeight: 'bold',
  },
});