import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  SafeAreaView,
  Alert
} from 'react-native';
import { DatabaseOperations } from '../db/db';
import { Workout, WorkoutExercise } from '../model/model';

// Demo data
const DEMO_WORKOUT: Workout = {
  id: 1,
  userID: 1,
  startTime: new Date().toISOString(),
  notes: ''
};

const DEMO_EXERCISES: (WorkoutExercise & { name: string, category: string })[] = [
  { id: 1, userId: 1, workoutId: 1, exerciseId: 1, order_index: 0, name: 'Bench Press', category: 'Chest' },
  { id: 2, userId: 1, workoutId: 1, exerciseId: 6, order_index: 1, name: 'Squat', category: 'Legs' },
  { id: 3, userId: 1, workoutId: 1, exerciseId: 21, order_index: 2, name: 'Bicep Curl', category: 'Arms' }
];

export default function WorkoutScreen({ navigation, route }: any) {
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<(WorkoutExercise & { name: string, category: string })[]>([]);
  const [useDemo, setUseDemo] = useState(true); // Set to false to use real database
  const [loading, setLoading] = useState(true);

  // Option to show a populated demo with exercises
  const [showPopulatedDemo, setShowPopulatedDemo] = useState(false);

  useEffect(() => {
    // Start a new workout when the screen loads
    startNewWorkout();

    // Add listener to reload data when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      if (currentWorkout?.id) {
        loadWorkoutExercises(currentWorkout.id);
      }
    });

    // Clean up the listener when the component is unmounted
    return unsubscribe;
  }, [navigation]);

  const startNewWorkout = async () => {
    setLoading(true);
    try {
      if (useDemo) {
        // Use demo data
        setCurrentWorkout(DEMO_WORKOUT);
        if (showPopulatedDemo) {
          setWorkoutExercises(DEMO_EXERCISES);
        } else {
          setWorkoutExercises([]);
        }
      } else {
        // Create a new workout in the database
        const startTime = new Date().toISOString();
        const workoutId = await DatabaseOperations.createWorkout(startTime);
        
        // Set the current workout
        setCurrentWorkout({
          id: workoutId,
          userID: 1, // Default user ID
          startTime: startTime,
        });

        // Load any exercises (should be empty for a new workout)
        await loadWorkoutExercises(workoutId);
      }
    } catch (error) {
      console.error('Error starting workout:', error);
      Alert.alert('Error', 'Failed to start a new workout.');
    } finally {
      setLoading(false);
    }
  };

  const loadWorkoutExercises = async (workoutId: number) => {
    try {
      if (!useDemo) {
        const exercises = await DatabaseOperations.getWorkoutExercises(workoutId);
        setWorkoutExercises(exercises);
      }
    } catch (error) {
      console.error('Error loading workout exercises:', error);
    }
  };

  const navigateToExerciseSelect = () => {
    if (!currentWorkout?.id) {
      Alert.alert('Error', 'No active workout found.');
      return;
    }

    navigation.navigate('ExerciseSelect', { 
      workoutId: currentWorkout.id,
      onExerciseAdded: handleExerciseAdded 
    });
  };

  const handleExerciseAdded = async () => {
    // Refresh workout exercises after adding a new one
    if (currentWorkout?.id) {
      if (useDemo) {
        // In demo mode, just add a random exercise for demonstration
        const demoExerciseOptions = [
          { id: Math.random(), workoutId: 1, exerciseId: 11, order_index: workoutExercises.length, name: 'Deadlift', category: 'Back' },
          { id: Math.random(), workoutId: 1, exerciseId: 16, order_index: workoutExercises.length, name: 'Shoulder Press', category: 'Shoulders' },
          { id: Math.random(), workoutId: 1, exerciseId: 23, order_index: workoutExercises.length, name: 'Tricep Extension', category: 'Arms' }
        ];
        
        // Add a random exercise from options
        const randomIndex = Math.floor(Math.random() * demoExerciseOptions.length);
        const newExercise = demoExerciseOptions[randomIndex];
        
        setWorkoutExercises([...workoutExercises, { ...newExercise, userId: 1 }]);
      } else {
        // Real mode - load from database
        await loadWorkoutExercises(currentWorkout.id);
      }
    }
  };

  const finishWorkout = async () => {
    if (!currentWorkout?.id) {
      Alert.alert('Error', 'No active workout found.');
      return;
    }

    if (workoutExercises.length === 0) {
      Alert.alert('Warning', 'No exercises have been added to this workout. Are you sure you want to finish?', [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes, Finish Empty Workout',
          onPress: async () => {
            await handleFinishWorkout();
          }
        }
      ]);
    } else {
      await handleFinishWorkout();
    }
  };

  const handleFinishWorkout = async () => {
    try {
      if (useDemo) {
        // Demo mode - just navigate to summary
        navigation.navigate('WorkoutSummary', { workoutId: currentWorkout?.id });
      } else {
        // Update workout end time in database
        const endTime = new Date().toISOString();
        await DatabaseOperations.updateWorkoutEndTime(currentWorkout?.id!, endTime);
        
        // Navigate to workout summary
        navigation.navigate('WorkoutSummary', { workoutId: currentWorkout?.id });
      }
    } catch (error) {
      console.error('Error finishing workout:', error);
      Alert.alert('Error', 'Failed to finish workout.');
    }
  };

  const renderExerciseItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.exerciseItem}
      onPress={() => navigation.navigate('ExerciseSet', { 
        workoutId: currentWorkout?.id,
        workoutExerciseId: item.id,
        exerciseName: item.name,
        onSetAdded: handleExerciseAdded
      })}
    >
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={styles.exerciseCategory}>{item.category}</Text>
    </TouchableOpacity>
  );
  
  const toggleDemoMode = () => {
    // For demonstration purposes only
    setShowPopulatedDemo(!showPopulatedDemo);
    if (!showPopulatedDemo) {
      setWorkoutExercises(DEMO_EXERCISES);
    } else {
      setWorkoutExercises([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Current Workout</Text>
        {currentWorkout && (
          <Text style={styles.timeText}>
            Started: {new Date(currentWorkout.startTime).toLocaleTimeString()}
          </Text>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Starting workout...</Text>
        </View>
      ) : workoutExercises.length > 0 ? (
        <FlatList
          data={workoutExercises}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderExerciseItem}
          style={styles.exerciseList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No exercises added yet.</Text>
          <Text style={styles.emptyStateSubText}>Tap "+" to add exercises to your workout.</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={navigateToExerciseSelect}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        {workoutExercises.length > 0 && (
          <TouchableOpacity 
            style={styles.finishButton}
            onPress={finishWorkout}
          >
            <Text style={styles.finishButtonText}>Finish Workout</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Demo Mode Indicator */}
      {useDemo && (
        <View style={styles.demoIndicator}>
          <TouchableOpacity onPress={toggleDemoMode}>
            <Text style={styles.demoText}>
              DEMO MODE {showPopulatedDemo ? '(POPULATED)' : '(EMPTY)'}
            </Text>
          </TouchableOpacity>
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#ccc',
  },
  exerciseList: {
    flex: 1,
  },
  exerciseItem: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    padding: 20,
  },
  addButton: {
    backgroundColor: '#222',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  addButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  finishButton: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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