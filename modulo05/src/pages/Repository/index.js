import React, { Component } from 'react';
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
    page: 1,
  };

  async componentDidMount() {
    const { issueState, page } = this.setState;

    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: issueState,
          page,
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  callIssues = async () => {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const { page, issueState } = this.state;

    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: issueState,
        per_page: 5,
        page,
      },
    });

    this.setState({
      issues: issues.data,
      loading: false,
    });
  };

  handleSelectChange = async e => {
    await this.setState({ issueState: e.target.value, page: 1 });
    this.callIssues();
  };

  handlePagination = async action => {
    const { page } = this.state;

    await this.setState({
      page: action === 'next' ? page + 1 : page - 1,
    });

    this.callIssues();
  };

  render() {
    const { repository, issues, loading, issueState, page } = this.state;

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
            <select
              onChange={this.handleSelectChange}
              value={issueState}
              disabled={issues.length === 0}
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
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
            <button
              type="button"
              onClick={() => this.handlePagination('previous')}
              disabled={page < 2}
            >
              Previous
            </button>
            <span>{page}</span>
            <button
              type="button"
              onClick={() => this.handlePagination('next')}
              disabled={issues.length < 5}
            >
              Next
            </button>
          </Pagination>
        </Form>
      </Container>
    );
  }
}
