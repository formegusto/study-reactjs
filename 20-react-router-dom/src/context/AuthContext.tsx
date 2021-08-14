import React, { createContext, useContext, useState } from "react";

const authStore = {
  isAuthenticated: false,
  signin: (cb: (...args: any) => void) => {
    authStore.isAuthenticated = true;
    setTimeout(cb, 100);
  },
  signout: (cb: (...args: any) => void) => {
    authStore.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

const authContext = createContext<ReturnType<typeof useProvideAuth> | null>(
  null
);

function AuthProvider({ children }: React.PropsWithChildren<any>) {
  const value = useProvideAuth();
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState<string | null>(null);

  const signin = (cb: (...args: any) => void) => {
    return authStore.signin(() => {
      setUser("user");
      cb();
    });
  };

  const signout = (cb: (...args: any) => void) => {
    return authStore.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout,
  };
}

export { AuthProvider, useAuth, useProvideAuth };
