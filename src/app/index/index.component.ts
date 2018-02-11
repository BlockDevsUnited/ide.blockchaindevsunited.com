import { Component, OnInit } from '@angular/core';

import * as superagent from 'superagent';
import { environment as env } from '../../environments/environment';

declare var web3;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public index = 1;
  public accounts = web3.eth.accounts;
  public balance = 0;

  public codePages = [
    {
      'active': true,
      'name': '💩.sol',
      'code': `pragma solidity ^0.4.0;

contract PoopEmoji {
	mapping (address => uint) poop;

	function PoopEmoji() {
		poop[tx.origin] = 10000;
	}

	function sharePoop(address receiver, uint amount) returns(bool sufficient) {
		if (poop[msg.sender] < amount) return false;
		poop[msg.sender] -= amount;
		poop[receiver] += amount;
		return true;
	}

  function flushPoop(uint amount) returns(bool sufficient) {
		if (poop[msg.sender] < amount) return false;
		poop[msg.sender] -= amount;
		return true;
	}

	function getPoop(address addr) returns(uint) {
  	return poop[addr];
	}

}`
    }
  ]

  public code = this.codePages[0]['code'];

  public config = {
    language: "javascript",
    lineNumbers: true,
    lineNumberFormatter: (number) => {
      return "💩" + number
    }
  };

  constructor() {

  }

  ngOnInit() {
    console.log(web3);
    console.log(this.accounts);
    this.getBalance();
  }

  change() {
    for (var i = 0; i < this.codePages.length; i++) {
      if (this.codePages[i]['active'] == true) {
        this.codePages[i]['code'] = this.code;
      }
    }
  }

  setActive() {
    for (var i = 0; i < this.codePages.length; i++) {
      this.codePages[i]['active'] = false;
    }
  }

  public filename = "💩.sol";

  addPage() {
    this.setActive();
    this.codePages.push({
      'active': true,
      'name': this.filename,
      'code': `pragma solidity ^0.4.0;`
    });
    this.code = `pragma solidity ^0.4.0;`
    this.filename = "";
  }

  getBalance() {
    this.balance = web3.fromWei(web3.eth.getBalance(this.accounts[this.index - 1]).toNumber());
  }

  public contractIndex = 0;

  deployContract() {
    let code = this.codePages[this.contractIndex]['code'];
    superagent
    .post(env.api + "/solc")
    .send({
      code: code
    })
    .end((err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res.body);
        Object.keys(res.body.contracts).map((key) => {
          console.log(key)
          let abi = JSON.parse(res.body.contracts[key]['interface']);
          let bytecode = res.body.contracts[key]['bytecode'];
          let contract = web3.eth.contract(abi);
          let gas = res.body.contracts[key]['gasEstimates'];
          let contractInstance = contract.new(
          {
            data: '0x' + bytecode,
            from: this.accounts[this.index - 1],
            gas: 4200000,
            gasLimit: 10000000000
          },
          (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
            if (res.address) {
              console.log('Contract address: ' + res.address);
            }
          });
        });
      }
    });
  }

}
