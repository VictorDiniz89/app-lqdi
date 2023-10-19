import { useState } from 'react'
import FacebookLogo from './assets/facebook.svg'
import InstagramLogo from './assets/instagram.svg'
import LinkedinLogo from './assets/linkedin.svg'
import './App.css'
import * as Joi from 'joi'
import axios from 'axios'

const subscribeSchema = Joi.object({
  nome: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com', 'net'] } }).required()
})

function App() {

  const [subscriber, setSubscriber] = useState({
   nome: '',
   email: ''
  })
  const [subscriberError, setSubscriberError] = useState('') 
  const [subscriberSuccess, setSubscriberSuccess] = useState(false) 

  const clearData = () => {
    setSubscriber({ nome: '', email: '' })

    setSubscriberError('')
  }

  const handleChange = (ev) => {
    setSubscriber((previousValue) => (
      {
        ...previousValue,
        [ev.target.name]: ev.target.value        
      }
    ))
  }

  const isValidSubscriber = (subscriberData) => {
    const result = subscribeSchema.validate(subscriberData)
    
    if (result.error) {
      const [errorField] = result.error.details[0].path;
      
      setSubscriberError(`${errorField} inválido`)
      return false
    }
    setSubscriberError('')
    return true  
  }

  const doSubscribe = async () => {

        
    if (!isValidSubscriber(subscriber)) return
    
    try {
     
      const response = await axios.post('http://127.0.0.1:8000/api/usuarios', subscriber, {
        headers: {
          'Content-Type': 'application/json'
        }})
      if (response.status === 201) {
        clearData()
        setSubscriberSuccess(true)
      } else {
        setSubscriberError('Falha na inscricao')
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        setSubscriberError(error?.response?.data?.message)
      }
      console.log(error)
    }
  }
  
  return (
    <>
      <div className='box'>
        <div className='box-title'>
          <p className='title'>Receba os nossos artigo de interesse na sua caixa de entrada.</p>
        </div>
        <div className='box-input'>
          <input type="text" placeholder='Seu nome...' name='nome' value={subscriber.nome} onChange={handleChange} />
          <input type="text" placeholder='Escreva aqui seu e-mail...'  value={subscriber.email} name="email" 
                 style={{marginTop: '20px'}} onChange={handleChange} />
        </div>
        {subscriberError && <div className='box-error'>
          {subscriberError}
        </div>}
        {subscriberSuccess && <div className='box-success'>
          Inscrição registrada, obrigado.
        </div>}
        <div className='row'>
          <div className='box-social'>
            <p className='subtitle'>Siga-nos em nossas mídias sociais</p>
          </div>
          <button onClick={() => doSubscribe()}>Inscrever</button>

        </div>
        
        <div className='box-icon'>
          <div className='social-icon'>
            <img src={InstagramLogo} alt="Instagram" />
          </div>
          <div className='social-icon' style={{marginLeft: '13px'}}>
            <img src={FacebookLogo} alt="Facebook" />
          </div>
          <div className='social-icon' style={{marginLeft: '13px'}}>
            <img src={LinkedinLogo} alt="Linkedin" />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
