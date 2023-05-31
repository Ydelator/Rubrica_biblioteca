import './App.css'
import React from 'react'
import Libros from './components/Libros'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Inicio from './components/Inicio'
import Login from './components/Login'
import Admin from './components/Admin'
import Navbar from './components/Navbar'
import {firebase, auth } from './firebase'
import User from './components/User'
import Newadmin from './components/Newadmin'

function App() {
  const [firebaseUser, setFirebasUser] = React.useState(false)
  const [admin, setAdmin] = React.useState(null)
  React.useEffect(()=>{
    auth.onAuthStateChanged(user=>{
      console.log(user)
      if (user) {
        setFirebasUser(user)
      } else {
        setFirebasUser(null)
      }
      verificar()
    })

  },[])
  const verificar = async () =>{
    try {
      const db = firebase.firestore()
      const data = await db.collection('admin').get()
      const arrayData = data.docs.map(doc=>({
        ...doc.data()
      }))
      console.log(auth.currentUser.email)
      for (let index = 0; index < arrayData.length; index++) {
        if (arrayData[index].email == auth.currentUser.email) {
          setAdmin(true)
        }
        else{
          setAdmin(false)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  return firebaseUser !== false ?(
    <Router>
      <div className="container">
        <Navbar firebaseUser={firebaseUser} admin ={admin}></Navbar>
        <Routes>
          <Route path='/' element={<Inicio/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path='admin' element={<Admin/>}/>
          <Route path='user' element={<User/>}/>
          <Route path='newadmin' element={<Newadmin/>}/>
        </Routes>
      </div>
    </Router>
  ) :
  (<p>Loading...</p>)
}

export default App
