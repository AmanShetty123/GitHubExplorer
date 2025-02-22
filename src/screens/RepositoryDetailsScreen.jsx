import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Linking } from 'react-native';
import { Button, Card, Divider, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RepositoryDetailsScreen = ({ route}) => {
  const { repo } = route.params;

  const addToFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      
      if (!favorites.some((fav) => fav.id === repo.id)) {
        const updatedFavorites = [...favorites, repo];
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        alert('Repository added to favorites!');
      } else {
        alert('This repository is already in your favorites.');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites. Please try again.');
    }
  };

  const openGitHubRepo = () => {
    Linking.openURL(repo.html_url);
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.headerSection}>
        <Image 
          source={{ uri: repo.owner.avatar_url }} 
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.headerContent}>
          <Text style={styles.title}>{repo.name}</Text>
          <Text style={styles.ownerText}>by {repo.owner.login}</Text>
        </View>
      </Surface>

      <Card style={styles.descriptionCard}>
        <Card.Content>
          <Text style={styles.description}>{repo.description || 'No description available'}</Text>
        </Card.Content>
      </Card>

      <View style={styles.statsGrid}>
        <Surface style={styles.statCard}>
          <Icon name="star" size={24} color="#FFD700" />
          <Text style={styles.statNumber}>{repo.stargazers_count}</Text>
          <Text style={styles.statLabel}>Stars</Text>
        </Surface>

        <Surface style={styles.statCard}>
          <Icon name="source-fork" size={24} color="#6E5494" />
          <Text style={styles.statNumber}>{repo.forks_count}</Text>
          <Text style={styles.statLabel}>Forks</Text>
        </Surface>

        <Surface style={styles.statCard}>
          <Icon name="eye" size={24} color="#44A833" />
          <Text style={styles.statNumber}>{repo.watchers_count}</Text>
          <Text style={styles.statLabel}>Watchers</Text>
        </Surface>
      </View>

      <Card style={styles.detailsCard}>
        <Card.Content>
          <View style={styles.detailRow}>
            <Icon name="code-tags" size={20} color="#333" />
            <Text style={styles.detailText}>
              Language: {repo.language || 'Not specified'}
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Icon name="source-branch" size={20} color="#333" />
            <Text style={styles.detailText}>
              Default Branch: {repo.default_branch}
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Icon name="circle" size={20} color={repo.private ? '#FF4444' : '#44A833'} />
            <Text style={styles.detailText}>
              {repo.private ? 'Private Repository' : 'Public Repository'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={openGitHubRepo}
          style={[styles.button, styles.githubButton]}
          icon="github"
        >
          View on GitHub
        </Button>
        
        <Button
          mode="contained"
          onPress={addToFavorites}
          style={[styles.button, styles.favoriteButton]}
          icon="star"
        >
          Add to Favorites
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E1E4E8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#24292E',
    marginBottom: 4,
  },
  ownerText: {
    fontSize: 16,
    color: '#586069',
  },
  descriptionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  description: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    margin: 4,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#24292E',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#586069',
    marginTop: 2,
  },
  detailsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#444444',
    marginLeft: 12,
  },
  divider: {
    marginVertical: 8,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    elevation: 2,
  },
  githubButton: {
    backgroundColor: '#24292E',
  },
  favoriteButton: {
    backgroundColor: '#28A745',
  },
});

export default RepositoryDetailsScreen;