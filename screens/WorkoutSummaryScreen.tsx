import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { DatabaseOperations } from '../db/db';

export default function WorkoutSummaryScreen({ route, navigation }: any) {
  const { workoutId } = route.params;
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkoutData();
  }, []);

  const loadWorkoutData = async () => {
    try {
      if (workoutId) {
        const data = await DatabaseOperations.getWorkoutWithDetails(workoutId);
        setWorkoutData(data);
      }
    } catch (error) {
      console.error('Error loading workout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const calculateDuration = () => {
    if (!workoutData?.startTime || !workoutData?.endTime) return 'N/A';
    
    const start = new Date(workoutData.startTime).getTime();
    const end = new Date(workoutData.endTime).getTime();
    const durationMs = end - start;
    
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    
    return `${minutes}m`;
  };

  const getTotalVolume = () => {
    if (!workoutData?.exercises) return 0;
    
    let totalVolume = 0;
    
    workoutData.exercises.forEach((exercise: any) => {
      if (exercise.sets) {
        exercise.sets.forEach((set: any) => {
          totalVolume += set.weight * set.reps;
        });
      }
    });
    
    return totalVolume;
  };

  const getTotalSets = () => {
    if (!workoutData?.exercises) return 0;
    
    let totalSets = 0;
    
    workoutData.exercises.forEach((exercise: any) => {
      if (exercise.sets) {
        totalSets += exercise.sets.length;
      }
    });
    
    return totalSets;
  };

  const returnHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Workout Summary</Text>
          
          {loading ? (
            <Text style={styles.loadingText}>Loading workout data...</Text>
          ) : workoutData ? (
            <>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date:</Text>
                  <Text style={styles.summaryValue}>
                    {new Date(workoutData.startTime).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Started:</Text>
                  <Text style={styles.summaryValue}>
                    {formatDate(workoutData.startTime)}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Ended:</Text>
                  <Text style={styles.summaryValue}>
                    {workoutData.endTime ? formatDate(workoutData.endTime) : 'N/A'}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Duration:</Text>
                  <Text style={styles.summaryValue}>{calculateDuration()}</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Exercises:</Text>
                  <Text style={styles.summaryValue}>
                    {workoutData.exercises?.length || 0}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Sets:</Text>
                  <Text style={styles.summaryValue}>{getTotalSets()}</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Volume:</Text>
                  <Text style={styles.summaryValue}>{getTotalVolume()}</Text>
                </View>
              </View>
              
              <Text style={styles.sectionTitle}>Exercises</Text>
              
              {workoutData.exercises?.map((exercise: any, index: number) => (
                <View key={index} style={styles.exerciseCard}>
                  <Text style={styles.exerciseName}>
                    {exercise.name} ({exercise.category})
                  </Text>
                  
                  {exercise.sets?.map((set: any, setIndex: number) => (
                    <View key={setIndex} style={styles.setRow}>
                      <Text style={styles.setText}>Set {set.setNumber}:</Text>
                      <Text style={styles.setText}>{set.weight} lbs</Text>
                      <Text style={styles.setText}>{set.reps} reps</Text>
                    </View>
                  ))}
                </View>
              ))}
            </>
          ) : (
            <Text style={styles.errorText}>Failed to load workout data.</Text>
          )}
          
          <TouchableOpacity style={styles.button} onPress={returnHome}>
            <Text style={styles.buttonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 20,
  },
  summaryCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#ccc',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    marginTop: 10,
  },
  exerciseCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  setText: {
    fontSize: 14,
    color: '#ccc',
  },
  button: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});