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
import { ExerciseSet } from "../model/models";

export default function ExerciseSetScreen({ route, navigation }: any) {
  const currentWorkout = route.params.workout;
  const workoutExercise = route.params.workoutExercise;

  const [currentWeight, setCurrentWeight] = useState<string>("0");
  const [currentReps, setCurrentReps] = useState<string>("0");

  // Track completed sets
  const [completedSets, setCompletedSets] = useState<ExerciseSet[]>([]);

  // Current set number
  const [currentSetNumber, setCurrentSetNumber] = useState<number>(1);

  const handleNextSet = async () => {
    if (parseFloat(currentWeight) <= 0 && parseInt(currentReps) <= 0) {
      Alert.alert("Invalid Input", "Please enter valid weight and reps.");
      return;
    }

    const newSet: ExerciseSet = {
      workoutExerciseID: workoutExercise.id,
      setNumber: currentSetNumber,
      weight: parseFloat(currentWeight),
      reps: parseInt(currentReps),
    };

    try {
      setCompletedSets((prevSets) => [...prevSets, newSet]);
      setCurrentSetNumber((prev) => prev + 1);
      setCurrentWeight("0");
      setCurrentReps("0");
    } catch (error) {
      console.error("Error saving set:", error);
    }
  };

  const handleNextExercise = () => {};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Current Workout</Text>
        <Text style={styles.timeText}>
          Started: {new Date(currentWorkout.startTime).toLocaleTimeString()}
        </Text>
        <Text style={styles.timeText}>WorkoutID: {currentWorkout.id}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.exerciseName}>
            {workoutExercise.exercise.name}
          </Text>

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
 
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 0.5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  timeText: {
    fontSize: 14,
    marginTop: 5,
    color: "#7A7A7A",
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
    color: "#4A4A4A",
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
    backgroundColor: "#534948",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#553333",
    padding: 10,
    alignItems: "center",
  },
  demoText: {
    color: "#ff9999",
    fontWeight: "bold",
  },
});
