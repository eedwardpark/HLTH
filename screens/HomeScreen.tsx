import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  FlatList 
} from 'react-native';
import { DatabaseOperations } from '../db/db';

// Demo workout data
const DEMO_RECENT_WORKOUTS = [
  {
    id: 101,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600 * 1000).toISOString(),
    exerciseCount: 5,
    totalSets: 15,
    totalVolume: 5250
  },
  {
    id: 102,
    startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    endTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 4500 * 1000).toISOString(),
    exerciseCount: 4,
    totalSets: 12,
    totalVolume: 4800
  },
  {
    id: 103,
    startTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    endTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 3200 * 1000).toISOString(),
    exerciseCount: 3,
    totalSets: 9,
    totalVolume: 3600
  }
];

export default function HomeScreen({ navigation }: any) {
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [useDemo, setUseDemo] = useState(true); // Set to false to use real database
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load recent workouts when the component mounts
    loadRecentWorkouts();

    // Add listener to reload data when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecentWorkouts();
    });

    // Clean up the listener when the component is unmounted
    return unsubscribe;
  }, [navigation]);

  const loadRecentWorkouts = async () => {
    setLoading(true);
    try {
      if (useDemo) {
        // Use demo data
        setRecentWorkouts(DEMO_RECENT_WORKOUTS);
      } else {
        // Use actual database
        const workouts = await DatabaseOperations.getWorkouts();
        setRecentWorkouts(workouts.slice(0, 5)); // Get the 5 most recent workouts
      }
    } catch (error) {
      console.error('Error loading recent workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const startWorkout = () => {
    navigation.navigate('Workout');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const viewWorkoutDetails = (workoutId: number) => {
    navigation.navigate('WorkoutSummary', { workoutId });
  };

  const renderWorkoutItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.workoutItem} 
      onPress={() => viewWorkoutDetails(item.id)}
    >
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutDate}>{formatDate(item.startTime)}</Text>
        <Text style={styles.workoutTime}>
          {new Date(item.startTime).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
      
      {item.exerciseCount && (
        <View style={styles.workoutStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.exerciseCount}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.totalSets}</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.totalVolume}</Text>
            <Text style={styles.statLabel}>Volume</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>🏋️ HLTH</Text>
          
          <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading recent workouts...</Text>
            </View>
          ) : recentWorkouts.length > 0 ? (
            <View style={styles.recentWorkoutsContainer}>
              <Text style={styles.sectionTitle}>Recent Workouts</Text>
              <FlatList
                data={recentWorkouts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderWorkoutItem}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recent workouts found.</Text>
              <Text style={styles.emptySubText}>Start your fitness journey today!</Text>
            </View>
          )}
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
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 60, // Extra padding for demo indicator
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#333',
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    fontSize: 16,
  },
  recentWorkoutsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  workoutItem: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  workoutDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  workoutTime: {
    fontSize: 14,
    color: '#ccc',
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 2,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptySubText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
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