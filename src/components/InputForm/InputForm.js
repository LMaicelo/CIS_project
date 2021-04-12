import React, { useReducer, useState } from 'react';
import './InputForm.css';
import { Button } from '../App/App.elements';
import { SubmitContainer } from './InputForm.elements';

const formReducer = (state, event) => {
  if (event.reset) {
    return {
      name: '',
      timeFrame: '',
      timeIntervals: '',
    }
  }
  return {
    ...state,
    [event.name]: event.value
  }
}

function InputForm() {
  const [formData, setFormData] = useReducer(formReducer, {
    
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setFormData({
        reset: true
      })
    }, 3000)
  }

  const handleChange = event => {
    setFormData({
      name: event.target.name,
      value:  event.target.value,
    });
  }

  return (
    <div className="wrapper">
      <h1>Please Fill Out the Following</h1>
      {submitting &&
        <div>
          You are submitting the following:
         <ul>
            {Object.entries(formData).map(([name, value]) => (
              <li key={name}><strong>{name}</strong>: {value.toString()}</li>
            ))}
          </ul>
        </div>
      }
      <form onSubmit={handleSubmit}>
        <fieldset disabled={submitting}>
          <label>
            <p>Product Name</p>
            <input name="name" onChange={handleChange} value={formData.name || ''} />
          </label>
        </fieldset>
        <fieldset disabled={submitting}>
          <label>
            <p>Time Frame</p>
            <input name="timeFrame" onChange={handleChange} value={formData.timeFrame || ''} />
          </label>
        </fieldset>
        <fieldset disabled={submitting}>
          <label>
            <p>Time Intervals</p>
            <select name="timeIntervals" onChange={handleChange} value={formData.timeIntervals || ''} >
              <option value="">--Please choose an option--</option>
              <option value="day">Days</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </label>
        </fieldset>
        <Button fontBig primary type="submit" disabled={submitting}>Submit</Button>
      </form>
    </div>
  )
}

export default InputForm;
