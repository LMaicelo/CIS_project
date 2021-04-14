import React from 'react'
import './Home.css'
import { Button, ButtonLink } from '../App/App.elements';

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="home-title">Trend Analysis Application</h1>
            <h3 className="home-subtitle">Please choose an option</h3>
            <ButtonLink to="/product-form">
                <Button fontBig primary>PRODUCT</Button>
            </ButtonLink>

            <ButtonLink to="/category-form">
                <Button fontBig primary>CATEGORY</Button>
            </ButtonLink>

        </div>
    )
}

export default Home
