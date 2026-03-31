import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000/api/todos/'

export default function App() {
  const [todos, setTodos] = useState([])
  const [titre, setTitre] = useState('')

  useEffect(() => { charger() }, [])

  const charger = () => axios.get(API).then(r => setTodos(r.data))

  const ajouter = (e) => {
    e.preventDefault()
    if (!titre.trim()) return
    axios.post(API, { titre, termine: false }).then(() => {
      setTitre('')
      charger()
    })
  }

  const basculer = (todo) => {
    axios.patch(`${API}${todo.id}/`, { termine: !todo.termine }).then(charger)
  }

  const supprimer = (id) => {
    axios.delete(`${API}${id}/`).then(charger)
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Ma Todo Liste</h1>
      <form onSubmit={ajouter} style={{ display: 'flex', gap: 8 }}>
        <input
          value={titre}
          onChange={e => setTitre(e.target.value)}
          placeholder="Nouvelle tâche..."
          style={{ flex: 1, padding: '8px 12px', fontSize: 16 }}
        />
        <button type="submit">Ajouter</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <input
              type="checkbox"
              checked={todo.termine}
              onChange={() => basculer(todo)}
            />
            <span style={{ flex: 1, textDecoration: todo.termine ? 'line-through' : 'none', color: todo.termine ? '#999' : '#000' }}>
              {todo.titre}
            </span>
            <button onClick={() => supprimer(todo.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}