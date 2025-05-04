import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import ExerciseSelectScreen from './screens/ExerciseSelectScreen';
import ExerciseSetScreen from './screens/ExerciseSetScreen';
import WorkoutSummaryScreen from './screens/WorkoutSummaryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#222',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'HLTH' }}
        />
        <Stack.Screen 
          name="Workout" 
          component={WorkoutScreen} 
          options={{ title: 'HLTH' }}
        />
        <Stack.Screen 
          name="ExerciseSelect" 
          component={ExerciseSelectScreen} 
          options={{ title: 'HLTH' }}
        />
        <Stack.Screen 
          name="ExerciseSet" 
          component={ExerciseSetScreen} 
          options={{ title: 'HLTH' }}
        />
        <Stack.Screen 
          name="WorkoutSummary" 
          component={WorkoutSummaryScreen} 
          options={{ title: 'HLTH' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}