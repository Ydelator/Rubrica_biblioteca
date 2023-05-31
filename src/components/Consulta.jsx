import React from 'react'
import {firebase, auth} from '../firebase'

const Consulta = (props) => {
  const [Lista, setLista] = React.useState([])
  const [librosPrest, setLibrosPrest] = React.useState([])
  const [actualizar, setActualizar] = React.useState(true)
  const [firebaseUser, setFirebasUser] = React.useState(false)
  const [user, setUser] = React.useState(null)
  const [filtroTitulo, setFiltroTitulo] = React.useState('')

  React.useEffect(()=>{
    const usuario = () =>{
      auth.onAuthStateChanged(user=>{
        console.log(user)
        if (user) {
          setFirebasUser(user)
          console.log(auth.currentUser.email)
          setUser(auth.currentUser.email)
        } else {
          setFirebasUser(null)
        }})
    }
  
    
    const obtenerDatos = async()=>{
      try{
        const db = firebase.firestore()
        const data=await db.collection('libros').get()
        const arrayData = data.docs.map(doc=>({
          id: doc.id,
          ...doc.data()
        }))
        const listaFiltrada = arrayData.filter(elemento => elemento.Disponibilidad !== 'Agotado')
        console.log(listaFiltrada)
        setLista(listaFiltrada)
      }catch (error){
        console.error(error)
      }
    }
    usuario()
    actualizarPrest()
    obtenerDatos()
  },[actualizar])

  const prestarLibro = async (id) =>{
    try {
      const db = firebase.firestore()
      await db.collection('libros').doc(id).update({
        Poseedor: auth.currentUser.email,
        Disponibilidad: 'Agotado'
      })
      setActualizar(!actualizar)
    } catch (error) {
      console.log(error)
    }
  }

  const actualizarPrest = async () =>{
    const db = firebase.firestore()
    const data = await db.collection('libros').get()
    const array = data.docs.map(doc=>({
      id: doc.id,
      ...doc.data()
    }))
    const filtrar = array.filter(elemento => elemento.Poseedor === auth.currentUser.email)
    await db.collection('usuarios').doc(auth.currentUser.email).update({
      Libros: filtrar
    })
    console.log(filtrar)
    setLibrosPrest(filtrar)
  }

  const devolver = async (id) =>{
    try {
      const db = firebase.firestore()
      await db.collection('libros').doc(id).update({
        Poseedor: '',
        Disponibilidad: 'Disponible'
      })
      setActualizar(!actualizar)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSelectChange = (event) => {
    setFiltroTitulo(event.target.value);
  };

  const mostrarTodos = () => {
    setFiltroTitulo('');
  };

  return user === auth.currentUser.email ? (
    <div>
      <h1 className='text-center'>Biblioteca</h1>
      <div className='col-3 m-3'>
      <select className='form-select' value={filtroTitulo} onChange={handleSelectChange}>
        <option value="">Mostrar todos</option>
        {Lista.map((elemento) => (
          <option key={elemento.id} value={elemento.Titulo}>
            {elemento.Titulo}
          </option>
        ))}
      </select>
      </div>
      <div className='d-flex flex-row justify-content-start flex-wrap'>
          {Lista.filter((elemento) =>
            filtroTitulo ? elemento.Titulo === filtroTitulo : true
          ).map((elemento) => (
            <div
              className='d-flex flex-column justify-content-around p-4 border border-dark border-opacity-75 mb-3 rounded p-2 col-lg-4 col-sm-12 col-md-6 col-xl-4 col-xs-12'
              key={elemento.id}
            >
              <h3>{elemento.Titulo}</h3>
              <h5>{elemento.Autor}</h5>
              <p>{elemento.Descripcion} {elemento.Año}</p>
              <h6>{elemento.Disponibilidad}</h6>
              <button
                onClick={() => prestarLibro(elemento.id)}
                className='btn btn-outline-primary m-2 rounded-3'
              >
                Prestar
              </button>
            </div>
          ))}
      </div>
      <hr />
      <h1 className='text-center'>Tus libros</h1>
      <div className='d-flex flex-row justify-content-start flex-wrap'>
        {librosPrest.map((elemento) => (
          <div
            className='d-flex flex-column justify-content-around p-4 border border-dark border-opacity-75 mb-3 rounded p-2 col-lg-4 col-sm-12 col-md-6 col-xl-4 col-xs-12'
            key={elemento.id}
          >
            <h3>{elemento.Titulo}</h3>
            <h5>{elemento.Autor}</h5>
            <p>{elemento.Descripcion} {elemento.Año}</p>
            <button
              onClick={() => devolver(elemento.id)}
              className='btn btn-outline-info m-2 rounded-3'
            >
              Devolver libro
            </button>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default Consulta