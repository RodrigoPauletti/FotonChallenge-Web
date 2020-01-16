import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroller";
import jwtDecode from "jwt-decode";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faFrown, faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import api from "../../services/api";

import "./styles.css";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      taskInfo: {},
      page: 1,
      loading: true,
      logout: false,
      filter: false,
      filteredTerm: ""
    };
  }

  componentDidMount() {
    this.loadTasks();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.filteredTerm !== this.state.filteredTerm) {
      this.handleCheck();
    }
  }

  loadTasks = async (
    page = 1,
    filteredTerm = "",
    nextPage = false,
    valueChanged = false
  ) => {
    if (!nextPage) {
      this.setState({ loadingTasks: true });
    }
    const response = await api.get(
      `/tasks?page=${page}&filter=${filteredTerm}`
    );

    const { docs, ...taskInfo } = response.data;
    if (!this.state.name) {
      this.setName();
    }

    let tasks = [...this.state.tasks, ...docs];
    if ((filteredTerm !== "" && page === 1) || valueChanged) {
      tasks = docs;
    }

    this.setState({
      tasks,
      taskInfo,
      page,
      loadingTasks: false,
      loading: false,
      filter: filteredTerm ? true : false,
      filteredTerm
    });
  };

  setName = () => {
    const token = localStorage.getItem("token");
    const { name } = jwtDecode(token);
    this.setState({ name });
  };

  handleCheck = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const page = 1;
      this.setState({ page });
      this.loadTasks(page, this.state.filteredTerm, false, true);
    }, 300);
  };

  splitTaskTitle = (title, ellipsis = false) => {
    const titleSplited = title.split("\n");
    const itensCount = titleSplited.length;

    return titleSplited.map((item, key) => {
      return (
        <span key={key}>
          {item}
          {key < itensCount - 1 ? <br /> : ellipsis ? "..." : ""}
        </span>
      );
    });
  };

  splitTaskDescription = (description, ellipsis = false) => {
    const descriptionSplited = description.split("\n");
    const itensCount = descriptionSplited.length;

    return descriptionSplited.map((item, key) => {
      return (
        <span key={key}>
          {item}
          {key < itensCount - 1 ? <br /> : ellipsis ? "..." : ""}
        </span>
      );
    });
  };

  nextPage = () => {
    const { page, taskInfo, filteredTerm } = this.state;

    if (page === taskInfo.pages) return;

    const pageNumber = page + 1;
    this.loadTasks(pageNumber, filteredTerm, true);
  };

  hasMore = () => {
    const { page, taskInfo } = this.state;

    if (page < taskInfo.pages) return true;
    return false;
  };

  deleteTask = async (e, task_id) => {
    e.preventDefault();
    this.setState({ loadingTasks: true });

    await api
      .delete(`/tasks/${task_id}`)
      .then(() => {
        toast.success("Task deleted!");
        this.loadTasks(1, "", false, true);
      })
      .catch(err => {
        let error = "";
        if (err.response) {
          error = err.response.data.error || err.response.statusText;
        } else {
          error = "Network error";
        }
        toast.error(error);
      });
  };

  logout = () => {
    localStorage.removeItem("token");
    this.setState({ logout: true });
  };

  render() {
    const { tasks, name, loading, loadingTasks, logout, filter } = this.state;
    const maxTitleLength = 100;
    const maxDescriptionLength = 108;

    if (logout) {
      return <Redirect to="/login" />;
    } else {
      if (loading) {
        return (
          <div className="loading-task-list">
            <FontAwesomeIcon icon={faSpinner} pulse />
          </div>
        );
      } else {
        return (
          <div className="task-list-container">
            <div className="task-list-header">
              <h1 className="title">Hello, {name}</h1>
              <strong className="subtitle">
                Check your tasks{" "}
                <span role="img" aria-label="emoji-hand-finder-down">
                  👇
                </span>
              </strong>
            </div>
            <Link className="link green" to="/" onClick={this.logout}>
              <FontAwesomeIcon icon={faSignOutAlt} rotation={180} /> Logout
            </Link>

            <input
              type="text"
              placeholder="search..."
              value={this.state.filteredTerm}
              onChange={e => this.setState({ filteredTerm: e.target.value })}
            />

            {loadingTasks ? (
              <div className="loading-task-list">
                <FontAwesomeIcon icon={faSpinner} pulse />
              </div>
            ) : (
              <div className="task-list">
                {tasks.length ? (
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={this.nextPage}
                    hasMore={this.hasMore()}
                    loader={
                      <div key={0}>
                        <div className="loading-items">
                          <FontAwesomeIcon icon={faSpinner} pulse />
                          <p>&nbsp;Loading more</p>
                        </div>
                      </div>
                    }
                  >
                    {tasks.map(task => (
                      <Link
                        className="task-link"
                        to={`task/${task._id}`}
                        key={task._id}
                      >
                        <article>
                          <div className="task-info">
                            {task.title.length > maxTitleLength ? (
                              <h2 className="title white">
                                {this.splitTaskTitle(
                                  task.title.substr(0, maxTitleLength),
                                  true
                                )}
                              </h2>
                            ) : (
                              <h2 className="title white">
                                {this.splitTaskTitle(task.title)}
                              </h2>
                            )}
                            {/* <h2 className="title white">{task.title}</h2> */}
                            {task.description.length > maxDescriptionLength ? (
                              <p className="subtitle white">
                                {this.splitTaskDescription(
                                  task.description.substr(
                                    0,
                                    maxDescriptionLength
                                  ),
                                  true
                                )}
                              </p>
                            ) : (
                              <p className="subtitle white">
                                {this.splitTaskDescription(task.description)}
                              </p>
                            )}
                          </div>
                          <button
                            className="delete-task link white"
                            onClick={e => this.deleteTask(e, task._id)}
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                            ></FontAwesomeIcon>
                          </button>
                        </article>
                      </Link>
                    ))}
                  </InfiniteScroll>
                ) : filter ? (
                  <div className="no-results">
                    <p className="subtitle">
                      No results{" "}
                      <FontAwesomeIcon icon={faFrown}></FontAwesomeIcon>
                    </p>
                  </div>
                ) : (
                  <div className="no-results">
                    <p className="subtitle task-tip">
                      Click on the icon
                      <span className="new-task new-task-tip"></span>
                      below to create your first task
                    </p>
                  </div>
                )}
              </div>
            )}
            <Link to="/new" className="new-task new-task-link"></Link>
          </div>
        );
      }
    }
  }
}

export default Main;
