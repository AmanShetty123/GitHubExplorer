import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from './screens/SearchScreen';
import RepositoryDetailsScreen from './screens/RepositoryDetailsScreen';
import FavoritesScreen from './screens/FavouritesScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Search" component={SearchScreen} options={{
          headerTitle: 'Github Repositories in One Place'
        }} />
        <Stack.Screen name="RepositoryDetails" component={RepositoryDetailsScreen} options={{headerTitle: 'Repository Details'}} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;