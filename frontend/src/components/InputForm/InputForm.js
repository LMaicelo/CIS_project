import React, { useReducer, useState } from 'react';
import './InputForm.css';
import { Button } from '../App/App.elements';
import { SubmitContainer } from './InputForm.elements';
import Output from '../Output/Output';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function InputForm(props) {

  const [startDate, setStartDate] = useState(new Date());

  const [endDate, setEndDate] = useState(new Date());

  const useProducts = props.products;

  const useCategories = props.categories;

  const useBrands = props.brands;

  const [state, setState] = useState({
    pName: "",
    cName: "",
    bName: "",
    timeIntervals: "",
    asinNumber: "",
    fullChartData: "",
    apiResponse: "",
    list: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [dataReady, setDataReady] = useState(false);

  function convertTimeInterval(timeInterval) {
    if (timeInterval == "day") {
      return 86400;
    }
    else if (timeInterval == "week") {
      return 604800;
    }
    else if (timeInterval == "month") {
      return 2629743;
    }
    else if (timeInterval == "year") {
      return 31556926;
    }
    else {
      return 31556926;
    }
  }

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitted(true);
    if (useProducts) {
      executeQuery_brandForRelatedProducts(startDate.getTime() / 1000 | 0, endDate.getTime() / 1000 | 0, convertTimeInterval(state.timeIntervals), state.asinNumber);
    } else if (useCategories) {
      executeQuery_getTimeDiffCategory(startDate.getTime() / 1000 | 0, endDate.getTime() / 1000 | 0, convertTimeInterval(state.timeIntervals), state.cName);
    } else if (useBrands) {
      executeQuery_getRelativeRatingBrand(startDate.getTime() / 1000 | 0, endDate.getTime() / 1000 | 0, convertTimeInterval(state.timeIntervals), state.bName);
    }
    // setTimeout(() => {
    //   setSubmitting(false);
    //   setState({
    //     pName: "",
    //     cName: "",
    //     bName: "",
    //     timeIntervals: "",
    //     asinNumber: "",
    //     fullChartData: "",
    //     apiResponse: ""
    //   });
    // }, 5000);
  }

  const handleChange = event => {
    const value = event.target.value;
    setState({
      ...state,
      [event.target.name]: value
    });
  }

  async function executeQuery_brandForRelatedProducts(startTime, endTime, timeInterval, productAsin) {
    let toReturn;
    fetch(`http://localhost:9000/accessOracle/brandForRelatedProducts?startTime=${startTime}&endTime=${endTime}&timeInterval=${timeInterval}&productAsin=${productAsin}`)
      .then(res => res.text())
      .then((res) => {
        //console.log("Response is: " + res);
        console.log("Response is: " + JSON.stringify(JSON.parse(res).chartData));
        console.log("Full val is: " + res);
        setState({ fullChartData: res });
        setDataReady(true);
        toReturn = res;
        return res;
      });
    return toReturn;
  }

  async function executeQuery_getTimeDiffCategory(startTime, endTime, timeInterval, catName) {
    let toReturn;
    fetch(`http://localhost:9000/accessOracle/getTimeDiffCategory?startTime=${startTime}&endTime=${endTime}&timeInterval=${timeInterval}&catName=${catName}`)
      .then(res => res.text())
      .then((res) => {
        //console.log("Response is: " + res);
        console.log("Response is: " + JSON.stringify(JSON.parse(res).chartData));
        setState({ fullChartData: res })
        setDataReady(true);
        toReturn = res;
        return res;
      });
    return toReturn;
  }

  async function executeQuery_getRelativeRatingBrand(startTime, endTime, timeInterval, brandName) {
    let toReturn;
    fetch(`http://localhost:9000/accessOracle/getRelativeRatingBrand?startTime=${startTime}&endTime=${endTime}&timeInterval=${timeInterval}&brandName=${brandName}`)
      .then(res => res.text())
      .then((res) => {
        //console.log("Response is: " + res);
        console.log("Response is: " + JSON.stringify(JSON.parse(res).chartData));
        setState({ fullChartData: res });
        setDataReady(true);
        toReturn = res;
        return res;
      });
    return toReturn;
  }

  // return [[title, asin], [title, asin], ...]
  async function getProductsLike(inputString) {
    let toReturn;
    await fetch(`http://localhost:9000/accessOracle/getProductAsins?inputTitle=${encodeURIComponent(inputString)}`)
      .then(res => res.text())
      .then((res) => {
        //console.log("Response is: " + res);
        setState({ apiResponse: res });
        toReturn = res;
        return res;
      });
    return toReturn;
  }

  async function handleClick(event) {
    event.preventDefault();
    let result = await getProductsLike(state.pName);
    let res = JSON.parse(result);
    setState({
      list: [res[0][0] + " " + res[0][1], res[1][0] + " " + res[1][1], res[2][0] + " " + res[2][1], res[3][0] + " " + res[3][2], res[4][0] + " " + res[4][1]]
    });
  }

  return (
    <div className="wrapper">
      <div className="input-form">
        <h1>Please Fill Out the Following</h1>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={submitting}>
            {useProducts &&
              <label>
                <p>Product Name</p>
                <input name="pName" onChange={handleChange} value={state.pName} />
                <Button fontBig primary onClick={handleClick}>Search</Button>
                <div>
                  <ul>
                    {(state.list || []).map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </label>
            }
            {useCategories &&
              <label>
                <p>Category Name</p>
                <input name="cName" onChange={handleChange} value={state.cName} />
              </label>
            }
            {useBrands &&
              <label>
                <p>Brand Name</p>
                <input name="bName" onChange={handleChange} value={state.bName} />
              </label>
            }
          </fieldset>
          {useProducts &&
            <fieldset disabled={submitting}>
              <label>
                <p>ASIN Number</p>
                <input name="asinNumber" onChange={handleChange} value={state.asinNumber} />
              </label>
            </fieldset>
          }
          <fieldset disabled={submitting}>
            <label>
              <p>Time Frame</p>
              <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
              <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
            </label>
          </fieldset>
          <fieldset disabled={submitting}>
            <label>
              <p>Time Intervals</p>
              <select name="timeIntervals" onChange={handleChange} value={state.timeIntervals}>
                <option value="">--Please choose an option--</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </label>
          </fieldset>
          <Button fontBig primary type="submit" disabled={submitting}>Submit</Button>
        </form>
      </div>
      {dataReady && <Output fullChartData={JSON.parse(state.fullChartData)} />}
    </div>
  )
}

export default InputForm;

