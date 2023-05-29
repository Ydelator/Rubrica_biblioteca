import React from 'react'
import {firebase} from '../firebase'

const Consulta = () => {
  const [Lista, setLista] = React.useState([])

  React.useEffect(()=>{
    const obtenerDatos = async()=>{
      try{
        const db = firebase.firestore()
        const data=await db.collection('libros').get()
        //console.log(data.docs)
        const arrayData = data.docs.map(doc=>({
          id: doc.id,
          ...doc.data()
        }))
        const listaFiltrada = arrayData.filter(elemento => elemento.Disponibilidad != 'Agotado')
        setLista(listaFiltrada)
        console.log(Lista)
      }catch (error){
        console.error(error)
      }
    }
    obtenerDatos()
  },[])
  return (
    <div>
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
    </div>
  )
}

export default Consulta