import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Exercise, ExerciseSet } from "../model/model";

export default function ExerciseSetScreen({ route, navigation }: any) {
  const { exercise } = route.params;
  
  // Track current input values
  const [currentWeight, setCurrentWeight] = useState<string>("0");
  const [currentReps, setCurrentReps] = useState<string>("0");

  // Track completed sets
  const [completedSets, setCompletedSets] = useState<ExerciseSet[]>([]);
  
  // Current set (always the one being entered)
  const [currentSet, setCurrentSet] = useState<ExerciseSet>({
    userID: 1,
    workoutExerciseID: 1,
    setNumber: 1,
    weight: 0,
    reps: 0
  });

  const handleNextSet = () => {
    // Save the current set to completed sets
    const newCompletedSet: ExerciseSet = {
      ...currentSet,
      weight: parseFloat(currentWeight) || 0,
      reps: parseInt(currentReps) || 0
    };
    
    setCompletedSets([...completedSets, newCompletedSet]);
    
    // Create next set with incremented set number
    setCurrentSet({
      userID: 1,
      workoutExerciseID: 1,
      setNumber: currentSet.setNumber + 1,
      weight: 0,
      reps: 0
    });
    
    // Reset input fields
    setCurrentWeight("0");
    setCurrentReps("0");
  };

  const handleNextExercise = () => {
    // Save current set if it has data
    if (parseFloat(currentWeight) > 0 || parseInt(currentReps) > 0) {
      handleNextSet();
    }
    
    // All sets for this exercise
    const allSets = [...completedSets];
    console.log("Done with this exercise! Sets:", allSets);
    // TODO: Navigate or save the workout data
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          
          {/* Display completed sets */}
          {completedSets.map((set, index) => (
            <View key={index} style={styles.setCard}>
              <Text style={styles.setLabel}>Set {set.setNumber}</Text>
              <View style={styles.setInfo}>
                <Text style={styles.setInfoText}>Weight: {set.weight}</Text>
                <Text style={styles.setInfoText}>Reps: {set.reps}</Text>
              </View>
            </View>
          ))}

          {/* Current set input form */}
          <View style={styles.setCard}>
            <Text style={styles.setLabel}>Set {currentSet.setNumber}</Text>
            <TextInput
              style={styles.input}
              placeholder="Weight"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={currentWeight}
              onChangeText={setCurrentWeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={currentReps}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 17,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    flex: 1,
    marginRight: 25, // To balance with back button
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  exerciseName: {
    fontSize: 24,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
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
  },
});