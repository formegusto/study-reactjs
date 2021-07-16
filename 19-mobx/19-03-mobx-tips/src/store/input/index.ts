import { action, makeAutoObservable } from "mobx";
import React from "react";

export type InputObject = {
  [key: string]: any;
};

class InputStore {
  input: InputObject;

  constructor(input: InputObject) {
    makeAutoObservable(this, {
      changeInput: action.bound,
    });
    this.input = input;
  }

  changeInput(e: React.ChangeEvent<any>) {
    console.log(e.target.name);
    console.log(e.target.value);
    const copy = this.input;
    this.input = {
      ...copy,
      [e.target.name]: e.target.value,
    };
    // this.input[e.target.name] = e.target.value;
  }
}

export default InputStore;
