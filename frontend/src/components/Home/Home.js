import React from 'react'
import './Home.css'
import { Button, ButtonLink } from '../App/App.elements';

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="home-title">Trend Analysis Application</h1>
            <h3 className="home-subtitle">Please choose an option</h3>
            <ButtonLink to="/product-form">
                <Button fontBig primary>Find Brands with a Good Ecosystem for a Product</Button>
            </ButtonLink>
            <h1></h1>
            <ButtonLink to="/category-form">
                <Button fontBig primary>Compare Brands Who Sell Products from a Category in their Popularity Growth</Button>
            </ButtonLink>
            <h1></h1>
            <ButtonLink to="/brand-form">
                <Button fontBig primary>Analyze Ratings Accounting for Personal Biases in a Brand</Button>
            </ButtonLink>

        </div>
    )
}

export default Home
