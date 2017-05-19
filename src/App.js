import React, { Component } from 'react';
import bigi from 'bigi';
import bitcoin from 'bitcoinjs-lib';
import randomBytes from 'randombytes';
import './App.css';

class App extends Component {

  /**
   * Constructor
   *
   * @param  {any} props
   * @return {void}
   */
  constructor(props) {
    super(props);
    this.state = { keyPair: false };

    this.hitMe = this.hitMe.bind(this);
  }

  /**
   * Generate a BTC address and check its balance
   *
   * @return {void}
   */
  hitMe() {
    this.setState(prevState => ({ keyPair: false }));
    this.refs.button.setAttribute('disabled', 'disabled');

    const number = this.randomNumber();
    const keyPair = new bitcoin.ECPair(number)

    this.getAddress(keyPair.getAddress()).then(response => response.json()).then((address) => {
      this.setState(prevState => ({
        number: number,
        keyPair: keyPair,
        winnings: address.balance,
      }));

      this.refs.button.removeAttribute('disabled');
    })
  }

  /**
   * Get details about a BTC address
   *
   * @param  {string} address
   * @return {Object}
   */
  getAddress(address) {
    return fetch(`https://api.blocktrail.com/v1/btc/address/${address}?api_key=16d2fb459cc6c20d8ede96ae116e0e90454b9957`)
  }

  /**
   * Generate a random 256 bit integer
   *
   * @return {BigInt}
   */
  randomNumber() {
    return bigi.fromBuffer(randomBytes(32));
  }

  /**
   * Render the message
   *
   * @return {XML}
   */
  renderMessage() {
    return (
      <div className="Number">
        Your lucky number is <a href={`https://blockchain.info/address/${this.state.keyPair.getAddress()}`}>{this.state.number.toString()}</a>!<br />
        You have won {this.state.winnings} BTC!!
      </div>
    )
  }

  /**
   * Render the app
   *
   * @return {XML}
   */
  render() {
    let message = '';

    if(this.state.keyPair) {
      message = this.renderMessage();
    }

    return (
      <div className="App">
        <div className="App-header">
          <h1>BTC Lottery</h1>
        </div>
        { message }
        <button ref="button" onClick={ this.hitMe }>
          I'm feeling lucky
        </button>
      </div>
    );
  }
}

export default App;
