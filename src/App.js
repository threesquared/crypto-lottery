import React, { Component } from 'react';
import bigi from 'bigi';
import bitcoin from 'bitcoinjs-lib';
import blockr from 'blockr-unofficial';
import randomBytes from 'randombytes';
import typeforce from 'typeforce';
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
    const number = this.randomNumber();
    const keyPair = new bitcoin.ECPair(number)

    blockr().Addresses.Summary([keyPair.getAddress()], (err, resp) => {
      this.setState(prevState => ({
        number: number,
        keyPair: keyPair,
        winnings: resp[0].confirmedBalance,
      }));
    });
  }

  /**
   * Generate a random 256 bit integer
   *
   * @return {BigInt}
   */
  randomNumber() {
    var buffer = randomBytes(32)
    typeforce(typeforce.BufferN(32), buffer)

    return bigi.fromBuffer(buffer);
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
        <button onClick={ this.hitMe }>
          I'm feeling lucky
        </button>
      </div>
    );
  }
}

export default App;
