import React from 'react'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import Consulta from './Consulta'

const User = () => {
    const navigate = useNavigate()
    const [user, setUser] = React.useState(null)
    React.useEffect(()=>{
        if (auth.currentUser) {
            console.log('Existe un usuario')
            setUser(auth.currentUser.email)
        } else {
            console.log('No existe un usuario')
            navigate('/login')
        }
    },[navigate])
  return (
    <div>
        <h2>Ruta protegida</h2>
        {
            user && (
                <h3>Usuario: {user}</h3>
            )
        }
        <Consulta user = {user}></Consulta>
    </div>
  )
}

export default User