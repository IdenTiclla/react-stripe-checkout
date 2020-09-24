import React, { useState } from 'react';
import {loadStripe} from '@stripe/stripe-js'; // cargar la conexion a la plataform
import {Elements, CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import axios from 'axios';

import "bootswatch/dist/lux/bootstrap.min.css";
import './App.css';

const stripePromise = loadStripe("pk_test_WNH1ETQxlNXq0lDD2fLJ5u0t00Vl3d8iAa");

const CheckoutForm = () => {

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type:'card',
      card: elements.getElement(CardElement)
    })

    setLoading(true)

    if (!error) {
      const {id} = paymentMethod;
      try {
        
        const {data} = await axios.post('http://localhost:3001/api/checkout', {
        id,
        amount: 10000
        }) 
        console.log(data)
        elements.getElement(CardElement).clear()

      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }
  }

  return <form onSubmit={handleSubmit} className="card card-body">
      <img src="https://static-geektopia.com/storage/geek/products/corsair/k68/k68_na_red_05.png" alt="k68" className="img-fluid"/>
      <h3 className="text-center my-2">Price: 100$</h3>
      <div className="form-group">
        <CardElement className="form-control"/>
      </div>
      <button className="btn btn-success" disabled={!stripe}>
        {loading ? (
          <div className="spinner-border text-dark" role="status">
            <span className="sr-only">Loading...</span>
          </div>

        ): ("Buy")}
      </button>
  </form>
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <CheckoutForm/>  
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
