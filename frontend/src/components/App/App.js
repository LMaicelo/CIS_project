import React, { useReducer, useState } from 'react';
import './App.css';
import Chart from '../Chart'

// const formReducer = (state, event) => {
//   if (event.reset) {
//     return {
//       apple: '',
//       count: 0,
//       name: '',
//       'gift-wrap': false,
//     }
//   }
//   return {
//     ...state,
//     [event.name]: event.value
//   }
// }

// const [formData, setFormData] = useReducer(formReducer, {
//   count: 100,
// });
// const [submitting, setSubmitting] = useState(false);

// const handleSubmit = event => {
//   event.preventDefault();
//   setSubmitting(true);
//   setTimeout(() => {
//     setSubmitting(false);
//     setFormData({
//       reset: true
//     })
//   }, 3000)
// }

// const handleChange = event => {
//   const isCheckbox = event.target.type === 'checkbox';
//   setFormData({
//     name: event.target.name,
//     value: isCheckbox ? event.target.checked : event.target.value,
//   });
// }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "defaultval", chartLabel: "defaultLable", yAxisLabel: "Avg Rating", dataCoords: [{x:1, y: 2}, {x:3, y: 8}] };
  }

  callApi() {
    fetch("http://localhost:9000/accessOracle")
      .then(res => res.text())
      .then((res) => {
        console.log("Response is: " + res);
        return this.setState({ apiResponse: res });
      });
  }

  componentDidMount() {
    this.callApi();
  }
  
  render() {
    return (
      <div className="App">
        <h1>This is a form!</h1>
        <p>{this.state.apiResponse}</p>
        <Chart label={this.state.chartLabel} dataCoords={this.state.dataCoords} yAxisLabel={this.state.yAxisLabel}/>
        {/* {submitting &&
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
              <p>Category</p>
              <select name="apple" onChange={handleChange} value={formData.apple || ''} >
                <option value="">--Please choose an option--</option>
                <option value="fuji">Kitchen</option>
                <option value="jonathan">Exercise</option>
                <option value="honey-crisp">Diet</option>
              </select>
            </label>
            <label>
              <p>Count</p>
              <input type="number" name="count" onChange={handleChange} step="1" value={formData.count || ''} />
            </label>
            <label>
              <p>Condition</p>
              <input
                type="checkbox"
                name="gift-wrap"
                onChange={handleChange}
                checked={formData['gift-wrap'] || false}
                disabled={formData.apple !== 'fuji'} />
            </label>
          </fieldset>
          <button type="submit" disabled={submitting}>Submit</button>
        </form> */}
      </div>
    )
  }
}

export default App;
