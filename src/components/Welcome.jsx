import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import '../css/Welcome.css'

const Welcome = () => {
  
  return (
    <div className='welcome-screen'>
        <div className='container'>
            <img src={logo} alt='image'/>
            <Link to='/login'><button>Login As Administrator</button></Link>
        </div>
    </div>
  )
}

export default Welcome