import React from 'react'
import { Link } from 'react-router-dom'
import {firebase, auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

const Navbar = (props) => {
  const navigate = useNavigate()
    const cerrarSesion = () =>{
      auth.signOut()
      .then(()=>{
        navigate('/login')
      })
    }
  return (
    <div className='navbar navbar-dark bg-dark'>
        <Link className='navbar-brand' to={'/'}>Biblioteca</Link>
        <div className='d-flex'>
            <Link className='btn btn-dark' to={'/'}>Inicio</Link>
            {
              props.firebaseUser !== null && props.admin ==true ?(
                <div>
                <Link className='btn btn-dark' to={'/admin'}>Admin</Link>
                <Link className='btn btn-dark' to={'/newadmin'}>Convertir usuario</Link>
                </div>
              ):(null)
            }
            {
              props.firebaseUser !== null && props.admin==false ?(
                <Link className='btn btn-dark' to={'/user'}>Usuario</Link>
              ):(null)
            }
            {
              props.firebaseUser !== null ?(
                <button className='btn btn-danger' onClick={cerrarSesion}>Cerrar sesion</button>
              ):
              (<Link className='btn btn-dark' to={'/login'}>Login</Link>)
            }
        </div>
    </div>
  )
}

export default Navbar