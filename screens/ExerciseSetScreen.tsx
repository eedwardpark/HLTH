import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { DatabaseOperations } from "../db/db";
import { ExerciseSet } from "../model/model";

// Demo data for last workout
const DEMO_PREVIOUS_SETS = [
  { setNumber: 1, weight: 135, reps: 12 },
  { setNumber: 2, weight: 145, reps: 10 },
  { setNumber: 3, weight: 155, reps: 8 },
];

export default function ExerciseSetScreen({ route, navigation }: any) {
  const { workoutId, workoutExerciseId, exerciseName, onSetAdded } = route.params || {
    exerciseName: 'Bench Press', // Default for demo
    workoutId: 1,
    workoutExerciseId: 1
  };
  
  // Demo mode flag
  const [useDemo, setUseDemo] = useState(true); // Set to false to use real database
  
  // Track current input values
  const [currentWeight, setCurrentWeight] = useState<string>("0");
  const [currentReps, setCurrentReps] = useState<string>("0");

  // Track completed sets
  const [completedSets, setCompletedSets] = useState<ExerciseSet[]>([]);
  
  // Current set number
  const [currentSetNumber, setCurrentSetNumber] = useState<number>(1);

  // Demo last workout data flag
  const [showPreviousWorkout, setShowPreviousWorkout] = useState(true);

  useEffect(() => {
    // Load existing sets if any
    loadSets();
  }, []);

  const loadSets = async () => {
    try {
      if (useDemo) {
        // Just load empty sets for demo
        setCompletedSets([]);
        setCurrentSetNumber(1);
      } else if (workoutExerciseId) {
        const sets = await DatabaseOperations.getSetsForWorkoutExercise(workoutExerciseId);
        
        if (sets.length > 0) {
          setCompletedSets(sets);
          setCurrentSetNumber(sets.length + 1);
        }
      }
    } catch (error) {
      console.error('Error loading sets:', error);
    }
  };

  const handleNextSet = async () => {
    try {
      // Validate input
      const weight = parseFloat(currentWeight) || 0;
      const reps = parseInt(currentReps) || 0;
      
      if (weight <= 0 || reps <= 0) {
        Alert.alert("Invalid Input", "Please enter valid weight and reps.");
        return;
      }

      if (useDemo) {
        // Just simulate adding a set for demo
        const newSet: ExerciseSet = {
          id: Math.floor(Math.random() * 1000), // Demo ID
          userID: 1,
          workoutExerciseID: workoutExerciseId,
          setNumber: currentSetNumber,
          weight,
          reps
        };
        
        setCompletedSets([...completedSets, newSet]);
        setCurrentSetNumber(currentSetNumber + 1);
        
        // Reset input fields
        setCurrentWeight("0");
        setCurrentReps("0");
        
        console.log(`Added set ${currentSetNumber}: ${weight} lbs x ${reps} reps`);
      } else {
        // Save to database
        const setId = await DatabaseOperations.addSet(
          workoutExerciseId,
          currentSetNumber,
          weight,
          reps
        );
        
        // Update state
        const newSet: ExerciseSet = {
          id: setId,
          userID: 1,
          workoutExerciseID: workoutExerciseId,
          setNumber: currentSetNumber,
          weight,
          reps
        };
        
        setCompletedSets([...completedSets, newSet]);
        setCurrentSetNumber(currentSetNumber + 1);
        
        // Reset input fields
        setCurrentWeight("0");
        setCurrentReps("0");
        
        // Call onSetAdded callback if provided
        if (onSetAdded) {
          onSetAdded();
        }
      }
    } catch (error) {
      console.error('Error saving set:', error);
      Alert.alert("Error", "Failed to save exercise set.");
    }
  };

  const handleNextExercise = () => {
    // Check if there's data to save
    if (parseFloat(currentWeight) > 0 || parseInt(currentReps) > 0) {
      handleNextSet().then(() => {
        navigation.navigate('ExerciseSelect', { workoutId, onExerciseAdded: onSetAdded });
      });
    } else {
      navigation.navigate('ExerciseSelect', { workoutId, onExerciseAdded: onSetAdded });
    }
  };

  const handleFinishExercise = () => {
    // Check if there's data to save
    if (parseFloat(currentWeight) > 0 || parseInt(currentReps) > 0) {
      handleNextSet().then(() => {
        navigation.navigate('Workout');
      });
    } else {
      navigation.navigate('Workout');
    }
  };

  const preloadLastSet = () => {
    if (completedSets.length > 0) {
      const lastSet = completedSets[completedSets.length - 1];
      setCurrentWeight(lastSet.weight.toString());
      setCurrentReps(lastSet.reps.toString());
    } else if (showPreviousWorkout && DEMO_PREVIOUS_SETS.length > 0) {
      // Use demo data for first set
      const previousSet = DEMO_PREVIOUS_SETS[0];
      setCurrentWeight(previousSet.weight.toString());
      setCurrentReps(previousSet.reps.toString());
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.exerciseName}>{exerciseName}</Text>
          
          {/* Last workout info (demo) */}
          {showPreviousWorkout && completedSets.length === 0 && (
            <View style={styles.previousWorkoutCard}>
              <Text style={styles.previousWorkoutTitle}>Last Workout:</Text>
              {DEMO_PREVIOUS_SETS.map((set, index) => (
                <View key={index} style={styles.previousSetRow}>
                  <Text style={styles.previousSetText}>Set {set.setNumber}:</Text>
                  <Text style={styles.previousSetText}>{set.weight} lbs</Text>
                  <Text style={styles.previousSetText}>{set.reps} reps</Text>
                </View>
              ))}
              <TouchableOpacity 
                style={styles.useLastSetButton}
                onPress={preloadLastSet}
              >
                <Text style={styles.useLastSetButtonText}>Use Last Set</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Display completed sets */}
          {completedSets.map((set, index) => (
            <View key={index} style={styles.setCard}>
              <Text style={styles.setLabel}>Set {set.setNumber}</Text>
              <View style={styles.setInfo}>
                <Text style={styles.setInfoText}>Weight: {set.weight} lbs</Text>
                <Text style={styles.setInfoText}>Reps: {set.reps}</Text>
              </View>
            </View>
          ))}

          {/* Current set input form */}
          <View style={styles.setCard}>
            <Text style={styles.setLabel}>Set {currentSetNumber}</Text>
            <TextInput
              style={styles.input}
              placeholder="Weight"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={currentWeight === "0" ? "" : currentWeight}
              onChangeText={setCurrentWeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={currentReps === "0" ? "" : currentReps}
              onChangeText={setCurrentReps}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNextSet}>
            <Text style={styles.buttonText}>Next Set</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleNextExercise}>
            <Text style={styles.buttonText}>Next Exercise</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleFinishExercise}>
            <Text style={styles.buttonText}>Back to Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
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
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 60, // Extra padding for demo indicator
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
  },
  previousWorkoutCard: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#444",
  },
  previousWorkoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  previousSetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  previousSetText: {
    color: "#CCC",
    fontSize: 14,
  },
  useLastSetButton: {
    backgroundColor: "#553333",
    borderRadius: 5,
    padding: 8,
    alignItems: "center",
    marginTop: 10,
  },
  useLastSetButtonText: {
    color: "#ff9999",
    fontSize: 14,
  },
  setCard: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  setLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  setInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  setInfoText: {
    color: "#FFF",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#333",
    color: "#FFF",
    fontSize: 16,
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
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