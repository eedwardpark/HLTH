import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Workout } from "../model/models";

export default function HomeScreen({ navigation }: any) {
  const startWorkout = () => {
    const newWorkout: Workout = {
      id: 1234,
      userID: 1,
      startTime: new Date().toISOString(),
      notes: "",
    };
    navigation.navigate("Workout", { workout: newWorkout });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>🏋️ HLTH</Text>

          <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
            <Text style={styles.startButtonText}>Start Workout</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  startButton: {
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#333",
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
