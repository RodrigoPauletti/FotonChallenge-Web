import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import jwtDecode from "jwt-decode";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      emailClass: "",
      emailError: "",
      emailValid: false,
      password: "",
      passwordClass: "",
      passwordError: "",
      passwordValid: false,
      submitValid: false,
      loading: false,
      error: "",
      logged: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { token } = localStorage;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const date = new Date(0);
        if (date.setUTCSeconds(decoded.exp) >= Date.now()) {
          this.setState({ logged: true });
          return;
        }
        // expirated token
      } catch (err) {
        // invalid token
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.login();
  };

  login = async () => {
    const { email, password } = this.state;
    this.setState({ loading: true, error: "" });

    await api
      .post("/sessions", { email, password, withoutToken: true })
      .then(({ data: { token } }) => {
        localStorage.setItem("token", token);
        this.setState({ error: "", logged: true });
        toast.success("Successfully login");
        return;
      })
      .catch(err => {
        let error = "";
        if (err.response) {
          error = err.response.data.error || err.response.statusText;
        } else {
          error = "Network error";
        }
        toast.error(error);
        this.setState({ loading: false, error });
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
    const submitValid = emailValid && this.state.passwordValid;
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
    const submitValid = passwordValid && this.state.emailValid;
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
      email,
      emailError,
      emailClass,
      password,
      passwordError,
      passwordClass,
      submitValid,
      loading,
      error,
      logged
    } = this.state;

    if (logged) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="login-container">
          <div className="login-image"></div>

          <form className="login-form" onSubmit={this.handleSubmit}>
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
              className={`login-input-password ${passwordClass}`}
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

            {error ? <ToastContainer /> : ""}

            <div className="small-text">
              <p>
                No account?{" "}
                <Link to="/register" className="link">
                  Signup
                </Link>
              </p>
            </div>
            <button
              className="primary-button mw-auto"
              type="submit"
              disabled={loading || !submitValid}
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Login"}
            </button>
          </form>
        </div>
      );
    }
  }
}

export default Login;
