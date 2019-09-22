import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  Repository,
  OwnerAvatar,
  Info,
  Title,
  Author,
  NoStars,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: false,
    refreshing: false,
  };

  async componentDidMount() {
    this.loadStars();
  }

  loadStars = async () => {
    const { stars, page } = this.state;

    this.setState({ loading: true });

    const { navigation } = this.props;

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    if (response.data) {
      this.setState({
        stars: page === 1 ? response.data : [...stars, ...response.data],
        refreshing: false,
        loading: false,
      });
    }
  };

  loadMoreStars = async () => {
    const { page } = this.state;
    this.setState({ page: page + 1 }, () => this.loadStars());
  };

  handleRefresh = () => {
    this.setState({ page: 1, refreshing: true }, () => this.loadStars());
  };

  handleRepository = repository => {
    const { navigation } = this.props;

    navigation.navigate('FavRepository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, refreshing, loading } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator color="#ccc" />
            ) : (
              <NoStars>Help this user to favorite some repositories!</NoStars>
            )
          }
          renderItem={({ item }) => (
            <Starred onPress={() => this.handleRepository(item)}>
              <Repository>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Repository>
            </Starred>
          )}
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMoreStars}
          refreshing={refreshing}
          onRefresh={this.handleRefresh}
        />
      </Container>
    );
  }
}
