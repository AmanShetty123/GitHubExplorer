import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Searchbar,
  Card,
  Text,
  Button,
  Surface,
  IconButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);

  const checkInternetConnection = async () => {
    try {
      await axios.get('https://api.github.com');
      return true;
    } catch (error) {
      return false;
    }
  };

  const searchRepos = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setErrorType(null);

    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      setError('No internet connection. Please check your network and try again.');
      setErrorType('network');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars`
      );
      
      if (response.data.total_count === 0) {
        setError(`No repositories found for "${query}"`);
        setErrorType('noResults');
        setRepos([]);
      } else {
        setRepos(response.data.items);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setError('GitHub API rate limit exceeded. Please try again later.');
        } else {
          setError('Failed to fetch repositories. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setErrorType('other');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getEmptyStateContent = () => {
    switch (errorType) {
      case 'network':
        return {
          icon: 'wifi-off',
          title: 'No Internet Connection',
          message: 'Please check your network connection and try again.'
        };
      case 'noResults':
        return {
          icon: 'file-search-outline',
          title: 'No Results Found',
          message: `No repositories found matching "${query}". Try a different search term.`
        };
      case 'other':
        return {
          icon: 'alert-circle-outline',
          title: 'Error',
          message: error
        };
      default:
        return {
          icon: 'magnify',
          title: 'Search GitHub Repositories',
          message: 'Enter a search term to find repositories'
        };
    }
  };

  const EmptyListComponent = () => {
    const content = getEmptyStateContent();
    return (
      <Surface style={styles.emptyContainer}>
        <Icon 
          name={content.icon}
          size={48} 
          color="#586069" 
        />
        <Text style={styles.emptyTitle}>
          {content.title}
        </Text>
        <Text style={styles.emptyText}>
          {content.message}
        </Text>
        {errorType && (
          <Button
            mode="contained"
            onPress={searchRepos}
            style={styles.retryButton}
            icon="refresh"
          >
            Try Again
          </Button>
        )}
      </Surface>
    );
  };

  const renderRepository = ({ item }) => (
    <Card style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('RepositoryDetails', { repo: item })}
      >
        <Card.Content>
          <View style={styles.repoHeader}>
            <View style={styles.repoTitleContainer}>
              <Icon name="source-repository" size={20} color="#24292E" style={styles.repoIcon} />
              <Text style={styles.repoTitle} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            <Text style={styles.repoLanguage}>
              {item.language || 'N/A'}
            </Text>
          </View>

          <Text style={styles.repoDescription} numberOfLines={2}>
            {item.description || 'No description available'}
          </Text>

          <View style={styles.repoStats}>
            <View style={styles.statItem}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>
                {item.stargazers_count.toLocaleString()}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Icon name="source-fork" size={16} color="#6E5494" />
              <Text style={styles.statText}>
                {item.forks_count.toLocaleString()}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Icon name="eye" size={16} color="#44A833" />
              <Text style={styles.statText}>
                {item.watchers_count.toLocaleString()}
              </Text>
            </View>
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search repositories..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchRepos}
          style={styles.searchBar}
          iconColor="#24292E"
          right={() => query ? (
            <IconButton
              icon="close"
              size={20}
              onPress={() => setQuery('')}
            />
          ) : null}
        />
        
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Favorites')}
          style={styles.favoritesButton}
          icon="star"
        >
          Favorites
        </Button>
      </View>

      <FlatList
        data={repos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRepository}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={EmptyListComponent}
        onRefresh={searchRepos}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  searchBar: {
    marginBottom: 12,
    elevation: 0,
    backgroundColor: '#F5F6F8',
  },
  favoritesButton: {
    backgroundColor: '#28A745',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
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
  repoLanguage: {
    fontSize: 14,
    color: '#586069',
    marginLeft: 8,
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
    margin: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#24292E',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#586069',
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#28A745',
  },
});

export default SearchScreen;