import React, { Component } from 'react';
import { FaList, FaSpinner, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import {
  Loading,
  Owner,
  Form,
  IssueList,
  IssueState,
  SubmitButton,
  Pagination,
} from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    issueState: 'all',
  };

  async componentDidMount() {
    const { issueState } = this.setState;

    this.callRepository(issueState, 1);
  }

  handleSelectChange = e => {
    this.setState({ issueState: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });

    const { issueState } = this.state;

    this.callRepository(issueState, 1);
  };

  async callRepository(issueState, page) {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: issueState,
          per_page: 2,
          page,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading, issueState } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <Form onSubmit={this.handleSubmit}>
          <IssueState>
            <select onChange={this.handleSelectChange} value={issueState}>
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <SubmitButton loading={loading}>
              {loading ? (
                <FaSpinner color="#fff" size={14} />
              ) : (
                <FaList color="#fff" size={14} />
              )}
            </SubmitButton>
          </IssueState>
          <IssueList>
            {issues.map(issue => (
              <li key={String(issue.id)}>
                <img src={issue.user.avatar_url} alt={issue.user.login} />
                <div>
                  <strong>
                    <a href={issue.html_url}>{issue.title}</a>
                    {issue.labels.map(label => (
                      <span key={String(label.id)}>{label.name}</span>
                    ))}
                  </strong>
                  <p>{issue.user.login}</p>
                </div>
              </li>
            ))}
          </IssueList>
          <Pagination>
            <SubmitButton>
              {loading ? (
                <FaSpinner color="#fff" size={14} />
              ) : (
                <FaArrowLeft color="#fff" size={14} />
              )}
            </SubmitButton>
            <SubmitButton>
              {loading ? (
                <FaSpinner color="#fff" size={14} />
              ) : (
                <FaArrowRight color="#fff" size={14} />
              )}
            </SubmitButton>
          </Pagination>
        </Form>
      </Container>
    );
  }
}
