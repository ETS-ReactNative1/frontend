import React from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import saveUser from '../../redux/actions/saveUser';
import Header from '../Header';
import LandingFooter from '../LandingFooter';
import InputText from '../InputText';
import InputPassword from '../InputPassword';
import PrimaryButton from '../PrimaryButton';
import Spinner from '../SpinnerComponent';
import { API_BASE_URL } from '../../config';
import './LoginPage.css';

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      loading: false,
      errors: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  validate(email, password) {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];

    if (email.length < 5) {
      if (email.split("").filter(x => x === "@").length !== 1) {
        if (email.indexOf(".") === -1) {
          errors.push('Email is invalid');
        }
      }
    }

    if (password.length < 6) {
      errors.push('Password should be at least 6 characters long');
    }

    return errors;
  }


  handleSubmit() {
    const { history } = this.props;

    const { email, password } = this.state;

    const userCredentials = {
      email,
      password
    };

    this.setState({
      loading: true
    });

    const inputIsValid = this.validate(email, password);
    console.log(inputIsValid);
    if (inputIsValid.length === 0) {
      axios
        .post(`${API_BASE_URL}/users/login`, userCredentials)
        .then((res) => {
          if (res.data.status === 'success') {
            this.setState({
              loading: false
            });
            console.log('Login successful...');

            // save user data to store
            saveUser(res.data.data);

            // redirect to dashboard
            setTimeout(() => {
              history.push('/clusters');
            }, 1000);
          }
        })
        .catch((err) => {
          this.setState({
            loading: false
          });
          console.log(err);
          console.log('Check your email / password...');
        });
    } else {
      const errors = this.validate(email, password);
      if (errors.length > 0) {
        this.setState({ errors });
      }
    }


  }

  render() {
    const { errors, email, password, loading } = this.state;

    return (
      <div className="LoginPageContainer">
        <Header />
        <div className="LoginContent">
          <div className="LoginContentHeading">
            {errors.map((error) => (
              <p key={error}>
                Error:
                {error}
              </p>
            ))}
            <h1>Login to the cloud</h1>
          </div>
          <div className="LoginContentInputs">
            {/* Input fields */}
            <InputText
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => {
                this.handleChange(e);
              }}
            />
            <InputPassword
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => {
                this.handleChange(e);
              }}
            />

            <div className="LoginLinkContainer">
              <Link to="/forgot-password" className="LoginContentLink">Forgot your password?</Link>
            </div>

            <PrimaryButton
              label={loading ? <Spinner /> : 'login'}
              onClick={this.handleSubmit}
            />

            <div className="LoginContentBottomLink LoginLinkContainer">
              Not signed up? &nbsp;
              <Link to="/register" className="LoginContentLink">Create an account.</Link>
            </div>

          </div>
        </div>

        <div className="LoginPageFooter">
          <LandingFooter />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { user: state.user }
);

const mapDispatchToProps = {
  saveUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LoginPage));
