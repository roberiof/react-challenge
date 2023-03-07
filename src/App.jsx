import { useEffect, useRef, useState } from 'react'

// Understanding the exercise: 
//  The objective is putting a circle on the screen in the position you've clicked on and adding the redo and undo functionalities to this program.

function App() {
  const [circles , setCircles] = useState([])
  const [shownCircles , setShownCircles] = useState([])
  const page = useRef()
  let command = []

  const getLocalStorage = () =>{
    const circlesLocalStorage = JSON.parse(localStorage.getItem('circles'))
    const shownCirclesLocalStorage = JSON.parse(localStorage.getItem('shownCircles'))
    if(circlesLocalStorage && shownCirclesLocalStorage){
      setCircles(circlesLocalStorage)
      setShownCircles(shownCirclesLocalStorage)
    }
  }

  const setLocalStorage =  (array, key=null) =>{
    if(!key){
      localStorage.setItem('circles', JSON.stringify(array));
      localStorage.setItem('shownCircles', JSON.stringify(array));
      return 
    }
    localStorage.setItem(key, JSON.stringify(array));
  }

  useEffect( () => {  
    getLocalStorage()
    page.current.focus()
  }, [])

  const addCircles = (e) => {
    const top = e.clientY
    const left = e.clientX

    if(circles !== shownCircles){
      setCircles(shownCircles)
    }
      
    setCircles( prev => {
      let newCircle = {
      top: `${top}px`,
      left: `${left}px`,
      }
      let newArray = [...prev, newCircle]

      setShownCircles(newArray)
      setLocalStorage(newArray)
      return newArray
    })
  }
  
  const handleRedoUndo = (e) =>{
    const k = e.key.toLowerCase()
    if(k === 'control' && command.length === 0){
      command.push(k)
    }
    if(command.length === 1 && command[0] === 'control'){
      if(k === 'z'){
        undoCircle()
        command = []
      }else if(k === 'y'){
        redoCircle()
        command = []
      }
    }
  }

  const undoCircle = () =>{
    setShownCircles( prev => {
      const newArray = [...prev]
      newArray.pop()
      setLocalStorage(newArray, 'shownCircles')
      return newArray
    })
  }

  const redoCircle = () =>{
    let newArray = []
    const lastIndCircles = circles.length-1
    const lastIndShownCircles = shownCircles.length-1
    if(lastIndShownCircles+1 <= lastIndCircles){
      newArray = [...shownCircles, circles[lastIndShownCircles+1]]
      setShownCircles(newArray)
      setLocalStorage(newArray, 'shownCircles')
    }
  }

  return (
    <div className="page" tabIndex={0} ref={page} onClick={(e) => addCircles(e)} onKeyDown={(e) => handleRedoUndo(e)}> 
        {shownCircles&& shownCircles.map( (item, index) => 
          <span style={item} className='circle' key={index}> ⭕ </span>
      )}
    </div>
  )
}

export default App
