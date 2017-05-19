import React, { Component } from 'react';
import bigi from 'bigi';
import bitcoin from 'bitcoinjs-lib';
import blockr from 'blockr-unofficial';
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

    blockr().Addresses.Summary([keyPair.getAddress()], (err, resp) => {
      this.setState(prevState => ({
        number: number,
        keyPair: keyPair,
        winnings: resp[0].confirmedBalance,
      }));

      this.refs.button.removeAttribute('disabled');
    });
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
