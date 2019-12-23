import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import api from "../../services/api";

import {
  faArrowCircleLeft,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./styles.css";

class Task extends Component {
  state = {
    task: {},
    loading: true,
    error: false
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    await api
      .get(`/tasks/${id}`)
      .then(response => {
        this.setState({ task: response.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: true });
      });
  }

  splitTaskDescription = description => {
    const descriptionSplited = description.split("\n");
    const itensCount = descriptionSplited.length;

    return descriptionSplited.map((item, key) => {
      return (
        <span key={key}>
          {item}
          {key < itensCount - 1 ? <br /> : ""}
        </span>
      );
    });
  };

  render() {
    const { task, loading, error } = this.state;

    if (error) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="task-container">
          <Link className="link white" to="/">
            <FontAwesomeIcon icon={faArrowCircleLeft} /> Back to task list
          </Link>
          {loading ? (
            <div className="loading-task-info">
              <FontAwesomeIcon icon={faSpinner} pulse />
            </div>
          ) : (
            <div className="task-info">
              <h1 className="title white">{task.title}</h1>
              <p className="subtitle white">
                {this.splitTaskDescription(task.description)}
              </p>
            </div>
          )}
        </div>
      );
    }
  }
}

export default Task;
