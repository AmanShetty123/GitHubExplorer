import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Surface, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const removeFavorite = async (repoId) => {
    try {
      const updatedFavorites = favorites.filter(repo => repo.id !== repoId);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  const renderRepository = ({ item }) => (
    <Card style={styles.repoCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('RepositoryDetails', { repo: item })}
      >
        <Card.Content>
          <View style={styles.repoHeader}>
            <View style={styles.repoTitleContainer}>
              <Icon name="source-repository" size={20} color="#24292E" style={styles.repoIcon} />
              <Text style={styles.repoTitle}>{item.name}</Text>
            </View>
            <IconButton
              icon="star-off"
              size={20}
              onPress={() => removeFavorite(item.id)}
              style={styles.removeButton}
            />
          </View>
          
          <Text style={styles.repoDescription} numberOfLines={2}>
            {item.description || 'No description available'}
          </Text>

          <View style={styles.repoStats}>
            <View style={styles.statItem}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>{item.stargazers_count}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Icon name="source-fork" size={16} color="#6E5494" />
              <Text style={styles.statText}>{item.forks_count}</Text>
            </View>

            <View style={styles.statItem}>
              <Icon name="code-tags" size={16} color="#444444" />
              <Text style={styles.statText}>{item.language || 'N/A'}</Text>
            </View>
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  const EmptyListComponent = () => (
    <Surface style={styles.emptyContainer}>
      <Icon name="star-off" size={48} color="#586069" />
      <Text style={styles.noFavoritesText}>No favorites yet</Text>
      <Text style={styles.noFavoritesSubtext}>
        Add repositories to your favorites to see them here
      </Text>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRepository}
        ListEmptyComponent={EmptyListComponent}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#28A745']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  repoCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 8,
  },
  repoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  repoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  repoIcon: {
    marginRight: 8,
  },
  repoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#24292E',
    flex: 1,
  },
  removeButton: {
    margin: -8,
  },
  repoDescription: {
    fontSize: 14,
    color: '#586069',
    marginBottom: 12,
    lineHeight: 20,
  },
  repoStats: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#444444',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
  },
  noFavoritesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#24292E',
    marginTop: 16,
  },
  noFavoritesSubtext: {
    fontSize: 14,
    color: '#586069',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FavoritesScreen;