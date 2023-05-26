import './App.css'
import React from 'react'
import Libros from './components/Libros'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Inicio from './components/Inicio'
import Login from './components/Login'
import Admin from './components/Admin'
import Navbar from './components/Navbar'
import { auth } from './firebase'

function App() {
  const [firebaseUser, setFirebasUser] = React.useState(false)
  React.useEffect(()=>{
    auth.onAuthStateChanged(user=>{
      console.log(user)
      if (user) {
        setFirebasUser(user)
      } else {
        setFirebasUser(null)
      }
    })
  },[])
  return firebaseUser !== false ?(
    <Router>
      <div className="container">
        <Navbar firebaseUser={firebaseUser}></Navbar>
        <Routes>
          <Route path='/' element={<Inicio/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path='admin' element={<Admin/>}/>
        </Routes>
      </div>
    </Router>
  ) :
  (<p>Loading...</p>)
}

export default App
