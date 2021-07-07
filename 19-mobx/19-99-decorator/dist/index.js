"use strict";
// function authCheck(CheckComponent: (...args: any) => void) {
//   const auth: boolean = false;
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
//   return function () {
//     console.log("Auth Checking...");
//     CheckComponent(auth);
//   };
// }
// function App(auth: boolean) {
//   console.log(auth ? "Auth Checking Okay!" : "Need Auth!");
// }
// const AuthCheckApp = authCheck(App);
// AuthCheckApp();
function authCheck(auth) {
  return function (CheckComponent) {
    CheckComponent.prototype.auth = auth;
  };
}
var App = /** @class */ (function () {
  function App() {}
  App.prototype.render = function () {
    console.log(this.auth ? "Auth Checking Okay!" : "Need Auth!");
  };
  App = __decorate([authCheck(true)], App);
  return App;
})();
var app = new App();
app.render();
