import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native";

export default function WorkoutScreen({ navigation, route }: any) {
  const currentWorkout = route.params.workout;
  const selectExercise = () => {
    if (currentWorkout) {
      navigation.navigate("ExerciseSelect", { workout: currentWorkout });
    } else {
      Alert.alert(
        "No workout started",
        "Please start a workout before adding exercises."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Current Workout</Text>
        <Text style={styles.timeText}>
          Started: {new Date(currentWorkout.startTime).toLocaleTimeString()}
        </Text>
        <Text style={styles.timeText}>WorkoutID: {currentWorkout.id}</Text>
      </View>

      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No exercises added yet.</Text>
        <Text style={styles.emptyStateSubText}>
          Tap "+" to add exercises to your workout.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={selectExercise}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
  },
  exerciseList: {
    flex: 1,
  },
  exerciseItem: {
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseCategory: {
    fontSize: 14,
    marginTop: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#7A7A7A",
  },
  emptyStateSubText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    color: "#AAAAAA",
  },
  buttonContainer: {
    padding: 20,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 1,
  },
  addButtonText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
