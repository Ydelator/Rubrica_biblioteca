import React from 'react'
import { auth, firebase } from '../firebase'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = React.useState('')
    const [pass, setPass] = React.useState('')
    const [modo, setModo] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [lista, setLista] = React.useState([])
    const [nombre, setNombre] = React.useState('')
    const [apellido, setApellido] = React.useState('')

    const guardarDatos = (e) =>{
        e.preventDefault()
        if (!email.trim()) {
            setError('Ingrese el email')
            return
        }
        if (!pass.trim()) {
            setError('Ingrese la contraseña')
            return
        }
        if (pass.length<6) {
            setError('La contraseña debe ser mayor a 6 caracteres')
            return
        }
        setError(null)
        if (modo) {
            registrar()
        } else {
            login()
        }
    }

    const login = React.useCallback(async()=>{
        try {
            const res = await auth.signInWithEmailAndPassword(email, pass)
            console.log(res.user)
            setEmail('')
            setPass('')
            setError(null)
            const db = firebase.firestore()
            const data = await db.collection('admin').get()
            const arrayData = data.docs.map(doc=>({
                id: doc.id,
                ...doc.data()
            }))
            for (let index = 0; index < arrayData.length; index++) {
                if (arrayData[index].email == res.user.email) {
                    navigate('/admin')
                }else{
                    navigate('/user')
                }
            }

        } catch (error) {
            console.log(error.code)
            if (error.code === 'auth/wrong-password') {
                setError('La conraseña con coincide')
            }
            if (error.code === 'auth/user-not-found') {
                setError('Usuario no encontrado')
            }
        }
    }, [email, pass])

    const registrar = React.useCallback(async()=>{
        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass)
            const db = firebase.firestore()
            await db.collection('usuarios').doc(res.user.email).set({
                Nombre: nombre,
                Apellido: apellido,
                email: res.user.email,
                id: res.user.uid,
                Libros: []
            })
            console.log(res.user)
            setEmail('')
            setPass('')
            setError(null)
            navigate('/user')
        } catch (error) {
            console.error(error.code)
            if (error.code==='auth/invalid-email') {
                setError('Email invalido')
                return
            }
            if (error.code==='auth/email-already-in-use') {
                setError('El email ya esta registrado')
                return
            }
        }
    },[email, pass])

  return (
    <div className='login-registro'>
        <h3 className='text-center text-primary'>
            {
                modo ? 'Registro de usuario' :
                'Login'
            }</h3>
        <div className='row justify-content-center'>
            <div className='col-12 col-sm-8 col-md-6 col-xl-4'>
                <form className='form' onSubmit={guardarDatos}>
                    {
                        error && (
                            <div className='alert alert-danger'>
                                {error}
                            </div>
                        )
                    }
                    {
                        modo ? (
                            <div>
                            <input type="text" className='form-control mb-2' 
                            placeholder='Ingrese su Nombre' onChange={e=>setNombre(e.target.value.trim())}/>
                            <input type="text" className='form-control mb-2' 
                            placeholder='Ingrese su Apellido' onChange={e=>setApellido(e.target.value.trim())}/>
                            </div>
                        ):(null)
                    }
                    <input type="email" className='form-control mb-2' 
                    placeholder='Ingrese su email' onChange={e=>setEmail(e.target.value.trim())}/>
                    <input type="password" className='form-control mb-2' 
                    placeholder='Ingrese su contraseña' onChange={e=>setPass(e.target.value.trim())}/>
                    <div className='d-grid gap-2'>
                        <button className='btn btn-outline-success'>
                            {
                                modo ? 'Registrar' :
                                'Ingresar'
                            }
                        </button>
                        <button className='btn btn-outline-warning' type='button' onClick={()=>{setModo(!modo)}}>
                            {
                                modo ? 'Ya estas registrado' :
                                'No tienes cuenta?'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login