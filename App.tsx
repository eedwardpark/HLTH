import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ExerciseSelectScreen from './screens/ExerciseSelectScreen';
import ExerciseSetScreen from './screens/ExerciseSetScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ExerciseSelect" component={ExerciseSelectScreen} />
        <Stack.Screen name="ExerciseSet" component={ExerciseSetScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
