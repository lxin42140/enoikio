import React from "react";
import classes from "./Input.css";

const input = (props) => {
  let inputElement = null;
  let validationError = null;
  const inputClasses = [classes.InputElement];

  if (props.touched && !props.valid && props.shouldValidate) {
    inputClasses.push(classes.Invalid);
    validationError = <p>Enter a valid field</p>;
  } else if (props.elementType === "textarea") {
    inputClasses.push(classes.Textarea);
  }

  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          disabled={props.disabled}
          onChange={props.change}
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
        />
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          disabled={props.disabled}
          onChange={props.change}
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
          rows="5"
        />
      );
      break;
    case "number":
      inputElement = (
        <number
          disabled={props.disabled}
          onChange={props.change}
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          disabled={props.disabled}
          className={classes.InputElement}
          value={props.value}
          onChange={props.change}
        >
          {props.elementConfig.options.map((x) => (
            <option key={x.value} value={x.value}>
              {x.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = (
        <input
          disabled={props.disabled}
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.change}
        />
      );
  }

  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
      {validationError}
    </div>
  );
};

export default input;
