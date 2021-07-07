// function authCheck(CheckComponent: (...args: any) => void) {
//   const auth: boolean = false;

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

function authCheck(auth: boolean) {
  return function (CheckComponent: typeof App) {
    CheckComponent.prototype.auth = auth;
  };
}

@authCheck(true)
class App {
  [key: string]: any;

  render() {
    console.log(this.auth ? "Auth Checking Okay!" : "Need Auth!");
  }
}

const app = new App();
app.render();
