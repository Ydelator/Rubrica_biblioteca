import React from 'react'
import {firebase} from '../firebase'

const Libros = () => {
    //hooks
    const [Lista, setLista] = React.useState([])
    const [Titulo, setTitulo] = React.useState('')
    const [Autor, setAutor] = React.useState('')
    const [Año, setAno] = React.useState('')
    const [Descripcion, setDescripcion] = React.useState('')
    const [Id, setId] = React.useState('')
    const [modoEdicion, setModo] = React.useState(false)
    const [Error, setError] = React.useState(null)
    //Leer datos
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
          setLista(arrayData)
        }catch (error){
          console.error(error)
        }
      }
      obtenerDatos()
    },[])
    //Guardar
    const guardarDatos = async(e)=>{
      e.preventDefault()
      if (!Titulo) {
        setError("Ingrese el titulo")
        return
      }
      if (!Autor) {
        setError("Ingrese el autor")
        return
      }
      if (!Descripcion) {
        setError("Ingrese el descripcion")
        return
      }
      if (!Año) {
        setError("Ingrese el año")
        return
      }
      //Registrar
      try {
        const db = firebase.firestore()
        const nuevo = {
          Titulo: Titulo,
          Autor: Autor,
          Descripcion: Descripcion,
          Año: Año,
          Disponibilidad: 'Disponible',
          Poseedor: ''
        }
        const dato = await db.collection('libros').add(nuevo)
        setLista([
          ...Lista,
          {...nuevo, id:dato.id}
        ])
        setAno('')
        setAutor('')
        setDescripcion('')
        setTitulo('')
        setError(null)
      } catch (error) {
        console.error(error)
      }
    }
    //Eliminar
    const eliminarLibro = async(id)=>{
      if (modoEdicion) {
        setError("No puede eliminar mientras el libro es editado")
        return
      }
      try {
        const db = firebase.firestore()
        await db.collection('libros').doc(id).delete()
        const listaFiltrada = Lista.filter(elemento => elemento.id!==id)
        setLista(listaFiltrada)
      } catch (error) {
        console.error(error)
      }
    }
    //Editar
    const editar = async (libro) =>{
      setModo(true)
      setTitulo(libro.Titulo)
      setAutor(libro.Autor)
      setDescripcion(libro.Descripcion)
      setAno(libro.Año)
      setId(libro.id)
    }
    const editarLibro = async (e) =>{
      e.preventDefault()
      if (!Titulo) {
        setError("Ingrese el titulo")
        return
      }
      if (!Autor) {
        setError("Ingrese el autor")
        return
      }
      if (!Descripcion) {
        setError("Ingrese el descripcion")
        return
      }
      if (!Año) {
        setError("Ingrese el año")
        return
      }
      try {
        const db = firebase.firestore()
        await db.collection('libros').doc(Id).update({
          Titulo, Autor, Descripcion, Año
        })
        const listaEdit = Lista.map(elemento => elemento.id === Id ? {id:Id, Titulo:Titulo, Autor:Autor, Descripcion:Descripcion, Año:Año} :
          elemento
          )
        setLista(listaEdit)
        setAno('')
        setAutor('')
        setDescripcion('')
        setId('')
        setTitulo('')
        setModo(false)
        setError(null)
      } catch (error) {
        console.error(error)
      }
    }
  return (
    <div className='container'>
        {
          modoEdicion ? <h2 className='text-center text-success'>Editando libro</h2> :
          <h2 className='text-center text-primary'>Registro de libros</h2>
        }
        <form onSubmit={modoEdicion ? editarLibro : guardarDatos}>
          {
            Error ? (
              <div className='alert alert-danger' role='setError'>
                {Error}
            </div>
            ) :
            null
          }
          
          <input type="text" 
          placeholder='Ingrese el titulo del libro'
          className='form-control mb-2'
          value={Titulo}
          onChange={(e)=>{setTitulo(e.target.value.trim())}}/>
          <input type="text" 
          placeholder='Ingrese el autor del libro'
          className='form-control mb-2'
          value={Autor}
          onChange={(e)=>{setAutor(e.target.value.trim())}}/>
          <textarea className='form-control'
          placeholder='Ingrese la descripcion del libro'
          value={Descripcion}
          onChange={(e)=>{setDescripcion(e.target.value.trim())}}
          ></textarea>
          <input type="text" 
          placeholder='Ingrese el año del libro'
          className='form-control mb-2'
          value={Año}
          onChange={(e)=>{setAno(e.target.value.trim())}}/>
          <div className='d-grid gap-2'>
            {
              modoEdicion ? 
              <button type='submit' className='btn btn-outline-success'>Editar</button> :
              <button type='submit' className='btn btn-outline-info'>Registrar</button>
            }
            
          </div>
        </form>
        <h1 className='text-center'>Lista de libros biblioteca</h1>
        <ul className='list-group'>
          {
            Lista.map(
              (elemento)=>(
                <li className='list-group-item' key={elemento.id}> {elemento.Titulo}, {elemento.Autor}, {elemento.Descripcion}, 
                {elemento.Año}, {elemento.Disponibilidad}
                <button 
                onClick={()=>eliminarLibro(elemento.id)}
                className='btn btn-outline-danger m-2'>Eliminar</button>
                <button 
                onClick={()=>editar(elemento)}
                className='btn btn-outline-warning m-2'>Editar</button>
                </li>
              )
            )
          }
        </ul>
      </div>
  )
}

export default Libros