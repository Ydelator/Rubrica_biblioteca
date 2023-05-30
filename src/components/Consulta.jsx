import React from 'react'
import {firebase} from '../firebase'

const Consulta = (props) => {
  const [Lista, setLista] = React.useState([])
  const [librosPrest, setLibrosPret] =React.useState([])
  const [actualizar, setActualizar] = React.useState(true)
  var arrayLibros = [];

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
        const data2 = await db.collection('usuarios').get()
        const arrayData2 = data2.docs.map(doc=>({
          ...doc.data()
        }))
        const arrayData3 = []
        for (let index = 0; index < arrayData2.length; index++) {
          if (arrayData2[index].email==props.user) {
            arrayData3[index] = arrayData2[index].libros
          }
        }
        console.log(arrayData3)
      }catch (error){
        console.error(error)
      }
    }
    obtenerDatos()
  },[actualizar])
  
  const prestarLibro = async (id) =>{
    try {
      const db = firebase.firestore()
      await db.collection('libros').doc(id).update({
        Disponibilidad: 'Agotado'
      })
      for (let index = 0; index < Lista.length; index++) {
        if (Lista[index].id == id) {
          arrayLibros.push(Lista[index])
        }
      }
      console.log(arrayLibros)
      await db.collection('usuarios').doc(props.user).update({
        libros: arrayLibros
      })
      
      setActualizar(!actualizar)
    } catch (error) {
      console.log(error)
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
      
    </div>
  )
}

export default Consulta