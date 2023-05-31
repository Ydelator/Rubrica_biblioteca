import React, { useEffect } from 'react'
import {firebase, auth} from '../firebase'

const Newadmin = () => {
    const [lista, setLista] = React.useState([])
    const [actualizar, setActualizar] = React.useState(true)

    useEffect(()=>{
        const obtenerDatos = async ()=>{
            try {
                const db = firebase.firestore()
                const datos = await db.collection('usuarios').get()
                const arrayData = datos.docs.map(doc=>({
                    ...doc.data()
                }))
                setLista(arrayData)
            } catch (error) {
                console.error(error)
            }
        }
        obtenerDatos()
    },[actualizar])

    const hacerAdmin = async (dato) =>{
        try {
            const db = firebase.firestore()
            const data = await db.collection('usuarios').get()
            const arrayData = data.docs.map(doc=>({
                ...doc.data()
            }))
            const usuario = arrayData.filter(elemento=> elemento.email == dato.email)
            //console.log(usuario)
            const libro = await db.collection('libros').get()
            const libroMap = libro.docs.map(doc=>({
                id: doc.id,
                ...doc.data()
            }))
            //console.log(libroMap)
            for (let index = 0; index < libroMap.length; index++) {
                if (libroMap[index].Poseedor==dato.email) {
                    await db.collection('libros').doc(libroMap[index].id).update({
                        Disponibilidad: 'Disponible',
                        Poseedor: ''
                    })
                }
                //console.log(libroMap)
            }
            await db.collection('usuarios').doc(dato.email).delete()
            /*const nuevoAdmin = {
                Nombre: usuario.Nombre,
                Apellido: usuario.Apellido,
                email: usuario.email,
                id: usuario.id
            }*/
            await db.collection('admin').add({
                Nombre: dato.Nombre,
                Apellido: dato.Apellido,
                email: dato.email,
                id: dato.id
            })
            setActualizar(!actualizar)
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <div>
        <h1>Lista de usuarios</h1>
        <table>
            {
                lista.map((elemento)=>(
                    <li key={elemento.id}>{elemento.Nombre}, {elemento.Apellido}, {elemento.email}
                    <button className='btn btn-outline-success'
                    onClick={()=>hacerAdmin(elemento)}
                    >Hacer administrador</button>
                    </li>
                ))
            }
        </table>
    </div>
  )
}

export default Newadmin