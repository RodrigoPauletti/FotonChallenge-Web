import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import registerImage from "../../assets/register.svg";

class Register extends Component {
  state = {
    name: "",
    nameClass: "",
    nameError: "",
    email: "",
    emailClass: "",
    emailError: "",
    password: "",
    passwordClass: "",
    passwordError: "",
    submitValid: false,
    loading: false,
    error: "",
    created: false
  };

  handleSubmit = e => {
    e.preventDefault();
    this.register();
  };

  register = async () => {
    const { name, email, password } = this.state;
    this.setState({ loading: true, errzor: "" });

    await api
      .post("/users", { name, email, password, withoutToken: true })
      .then(async () => {
        toast.success("Account created!");
        await api
          .post("/sessions", { email, password, withoutToken: true })
          .then(({ data: { token } }) => {
            localStorage.setItem("token", token);
            this.setState({ created: true, error: "" });
          });
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

  handleName = e => {
    const name = e.target.value;
    const nameValid = name ? true : false;
    let nameClass = "";
    let nameError = "";
    if (!nameValid) {
      nameClass = "required";
      nameError = "field required";
    }
    const submitValid =
      nameValid && this.state.emailValid && this.state.passwordValid;
    this.setState({
      name,
      nameClass,
      nameError,
      nameValid,
      submitValid
    });
  };

  handleEmail = e => {
    const email = e.target.value;
    const emailValid = email ? true : false;
    let emailClass = "";
    let emailError = "";
    if (!emailValid) {
      emailClass = "required";
      emailError = "field required";
    }
    const submitValid =
      emailValid && this.state.nameValid && this.state.passwordValid;
    this.setState({
      email,
      emailClass,
      emailError,
      emailValid,
      submitValid
    });
  };

  handlePassword = e => {
    const password = e.target.value;
    const passwordValid = password && password.length >= 6 ? true : false;
    let passwordClass = "";
    let passwordError = "";
    if (!passwordValid) {
      passwordClass = "required";
      if (password.length > 0) {
        passwordError = "min length 6";
      } else {
        passwordError = "field required";
      }
    }
    const submitValid =
      passwordValid && this.state.nameValid && this.state.emailValid;
    this.setState({
      password,
      passwordClass,
      passwordError,
      passwordValid,
      submitValid
    });
  };

  render() {
    const {
      name,
      nameError,
      nameClass,
      email,
      emailError,
      emailClass,
      password,
      passwordError,
      passwordClass,
      submitValid,
      loading,
      error,
      created
    } = this.state;

    if (created) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="register-container">
          <div className="register-image"></div>

          <form className="register-form" onSubmit={this.handleSubmit}>
            <input
              className={nameClass}
              type="text"
              value={name}
              placeholder="name"
              disabled={loading}
              onChange={this.handleName}
            />
            {nameError ? (
              <p className="error-message small">{nameError}</p>
            ) : (
              ""
            )}

            <input
              className={emailClass}
              type="email"
              value={email}
              placeholder="email"
              disabled={loading}
              onChange={this.handleEmail}
            />
            {emailError ? (
              <p className="error-message small">{emailError}</p>
            ) : (
              ""
            )}

            <input
              className={`register-input-password ${passwordClass}`}
              type="password"
              value={password}
              placeholder="password"
              disabled={loading}
              onChange={this.handlePassword}
            />
            {passwordError ? (
              <p className="error-message small">{passwordError}</p>
            ) : (
              ""
            )}

            {error ? <p className="error-message">{error}</p> : ""}

            <div className="small-text">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="link">
                  Login
                </Link>
              </p>
            </div>
            <button
              className="primary-button mw-auto"
              type="submit"
              disabled={loading || !submitValid}
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Signup"}
            </button>
          </form>
        </div>
      );
    }
  }
}

export default Register;
