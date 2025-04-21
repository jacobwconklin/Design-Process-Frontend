import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import Router from './Router';
import NavHeader from './Navigation/NavHeader';
import { useState, createContext } from 'react';
import { UserContextType } from './Utils/Types';

function App() {

  // Context will hold this information to be accessible from anywhere in the App
  const [isAdmin, setIsAdmin] = useState(false);
  // Determines if user is logged in
  const [email, setEmail] = useState<string | null>(null);
  // auth token returned from backend in place of storing the user's actual password
  const [authToken, setAuthToken] = useState<string | null>(null);

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider
          value={{
            isAdmin, setIsAdmin,
            email, setEmail,
            authToken, setAuthToken // This is essentially the admin's
          }}
        >
          <div className='StaticBackground'></div>
          <Router />
          <NavHeader />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}



export const UserContext = createContext<UserContextType>({
  isAdmin: false,
  setIsAdmin: (isAdmin: boolean) => { },
  email: null,
  setEmail: (email: string) => { },
  authToken: null,
  setAuthToken: (authToken: string) => { }
});

export default App;
