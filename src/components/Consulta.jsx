import React from 'react'
import {firebase} from '../firebase'

const Consulta = (props) => {
  const [Lista, setLista] = React.useState([])
  const [librosPrest, setLibrosPrest] =React.useState([])
  const [actualizar, setActualizar] = React.useState(true)

  React.useEffect(()=>{
    const obtenerDatos = async()=>{
      try{
        const db = firebase.firestore()
        const data=await db.collection('libros').get()
        const arrayData = data.docs.map(doc=>({
          id: doc.id,
          ...doc.data()
        }))
        const listaFiltrada = arrayData.filter(elemento => elemento.Disponibilidad != 'Agotado')
        console.log(listaFiltrada)
        setLista(listaFiltrada)
      }catch (error){
        console.error(error)
      }
    }
    actualizarPrest()
    obtenerDatos()
  },[actualizar])

  const prestarLibro = async (id) =>{
    try {
      const db = firebase.firestore()
      await db.collection('libros').doc(id).update({
        Poseedor: props.user,
        Disponibilidad: 'Agotado'
      })
      actualizarPrest()
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
    const filtrar = array.filter(elemento => elemento.Poseedor == props.user)
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
      actualizarPrest()
      setActualizar(!actualizar)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1>Lista de libros disponibles</h1>
      <ul className='list-group'>
          {
            Lista.map(
              (elemento)=>(
                <li className='list-group-item' key={elemento.id}> {elemento.Titulo}, {elemento.Autor}, {elemento.Descripcion}, 
                {elemento.Año}, {elemento.Disponibilidad}
                <button
                onClick={()=>prestarLibro(elemento.id)}
                className='btn btn-outline-primary m-2'>Prestar</button>
                </li>
              )
            )
          }
      </ul>
      <hr />
      <h1>Lista de libros en posesion</h1>
      <ul className='list-group'>
        {
          librosPrest.map(
            (elemento)=>(
              <li className='list-group-item' key={elemento.id}>{elemento.Titulo}, {elemento.Autor}, {elemento.Descripcion}, 
              {elemento.Año}
              <button
              onClick={()=>devolver(elemento.id)}
              className='btn btn-outline-info m-2'>Devolver libro</button>
              </li>
              
            )
          )
        }
      </ul>
    </div>
  )
}

export default Consulta