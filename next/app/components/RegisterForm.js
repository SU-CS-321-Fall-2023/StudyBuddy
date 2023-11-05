const LoginForm = ({
    handleRegister,
    name,
    email,
    password,
    setEmail,
    setPassword,
    setName,
    setRegisterName,
  }) => {

    
  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }
  const handleNameChange = (event) => {
    setName(event.target.value)
  }

    
    return (
    
    <form
      className='login-form'
      onSubmit={handleRegister}
    >
        <div>
        name
        <input
          id='name'
          type="text"
          value={name}
          name="Name"
          onChange={handleNameChange}
        />
      </div>
      <div>
        email
        <input
          id='register-email'
          type="text"
          value={email}
          name="Email"
          onChange={handleEmailChange}
        />
      </div>
      <div>
        password
        <input
          id='register-password'
          type='password'
          value={password}
          name='Password'
          onChange={handlePasswordChange}
        />
      </div>
      <button
        type="submit"
        id='register-button'
      >register</button>
    </form>
  )
    }
  
  export default LoginForm