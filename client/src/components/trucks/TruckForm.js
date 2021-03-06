import _ from "lodash";
import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import TruckField from "./TruckField";
import LocationSearchInput from "../LocationSearchInput";
import validateVolume from "../../utils/validateVolume";
import formFields from "./truckFormFields";

class TruckForm extends Component {
  // renderFields() {
  //   return _.map(formFields, ({ label, name }) => {
  //     return (
  //       <Field
  //         key={name}
  //         component={OrderField}
  //         type="text"
  //         label={label}
  //         name={name}
  //       />
  //     );
  //   });
  // }
  render() {
    return (
      <div className="container">
        <form onSubmit={this.props.handleSubmit(this.props.onTruckSubmit)}>
          <Field
            key="model"
            component={TruckField}
            type="text"
            label="Model"
            name="model"
            placeholder="ISUZU"
          />
          <Field
            key="volume"
            component={TruckField}
            type="text"
            label="Volume"
            name="volume"
            placeholder="For example 240"
          />
          <Link
            to="/admin/dashboard/trucks"
            className="red btn-flat white-text"
            style={{ width: "120px" }}
          >
            <i className="material-icons left">navigate_before</i>
            Cancel
          </Link>
          <button
            type="submit"
            className="teal btn-flat right white-text"
            style={{ width: "120px" }}
          >
            Next
            <i className="material-icons right">navigate_next</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  // errors.volume = validateVolume(values.recipients || "");

  _.each(formFields, ({ name, noValueError }) => {
    if (!values[name]) {
      errors[name] = noValueError;
    }
  });

  if (isNaN(values["volume"])) {
    errors["volume"] =
      "Please enter a number. For example 24 is is the product of 2 X 3 X 4";
  }

  return errors;
}

export default reduxForm({
  validate,
  form: "truckForm",
  destroyOnUnmount: false
})(TruckForm);
