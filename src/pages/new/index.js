import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import api from "../../services/api";

import {
  faSpinner,
  faArrowCircleLeft
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./styles.css";

class New extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      titleClass: "",
      titleError: "",
      titleValid: false,
      description: "",
      descriptionClass: "",
      descriptionError: "",
      descriptionValid: false,
      submitValid: false,
      loading: false,
      error: "",
      created: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.addTask();
  };

  addTask = async () => {
    const { title, description } = this.state;
    this.setState({ loading: true, error: "" });

    await api
      .post(`/tasks`, { title, description })
      .then(() => {
        this.setState({ created: true, error: "" });
      })
      .catch(err => {
        let error = "";
        if (err.response) {
          error = err.response.data.error || err.response.statusText;
        } else {
          error = "Network error";
        }
        this.setState({ loading: false, error });
      });
  };

  handleTitle = e => {
    const title = e.target.value;
    const titleValid = title ? true : false;
    let titleClass = "";
    let titleError = "";
    if (!titleValid) {
      titleClass = "required";
      titleError = "field required";
    }
    const submitValid = titleValid && this.state.descriptionValid;
    this.setState({
      title,
      titleClass,
      titleError,
      titleValid,
      submitValid
    });
  };

  handleDescription = e => {
    const description = e.target.value;
    const descriptionValid =
      description && description.length >= 10 ? true : false;
    let descriptionClass = "";
    let descriptionError = "";
    if (!descriptionValid) {
      descriptionClass = "required";
      if (description.length > 0) {
        descriptionError = "min length 10";
      } else {
        descriptionError = "field required";
      }
    }
    const submitValid = descriptionValid && this.state.titleValid;
    this.setState({
      description,
      descriptionClass,
      descriptionError,
      descriptionValid,
      submitValid
    });
  };

  render() {
    const {
      title,
      titleError,
      titleClass,
      description,
      descriptionError,
      descriptionClass,
      submitValid,
      loading,
      error
    } = this.state;

    if (this.state.created) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="new-task-container">
          <div className="new-task-header">
            <h1 className="title">New task</h1>
            <strong className="subtitle">
              What do you want to do?{" "}
              <span role="img" aria-label="emoji-pensative">
                🤔
              </span>
            </strong>
          </div>
          <Link className="link" to="/">
            <FontAwesomeIcon icon={faArrowCircleLeft} /> Back to task list
          </Link>

          <form onSubmit={this.handleSubmit}>
            <input
              className={titleClass}
              type="text"
              value={title}
              placeholder="title"
              disabled={loading}
              onChange={this.handleTitle}
            />
            {titleError ? (
              <p className="error-message small">{titleError}</p>
            ) : (
              ""
            )}

            <textarea
              className={descriptionClass}
              value={description}
              placeholder="description"
              disabled={loading}
              onChange={this.handleDescription}
            ></textarea>
            {descriptionError ? (
              <p className="error-message small">{descriptionError}</p>
            ) : (
              ""
            )}

            {error ? <p className="error-message">{error}</p> : ""}
            <button
              className="primary-button mw-auto"
              disabled={loading || !submitValid}
              onClick={this.addTask}
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Add"}
            </button>
          </form>
        </div>
      );
    }
  }
}

export default New;
