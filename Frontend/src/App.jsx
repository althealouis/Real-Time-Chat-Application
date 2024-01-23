import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Register, Login, Chat } from './pages/pagesIndex'
// import RetrieveUser from './components/RetrieveUser'
import { UserContextProvider } from './components/UserContext'

function App() {

  return (
    <div className= ''>
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path='/chats' element={<Chat />}></Route>
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </div>
  )
}

export default App;
