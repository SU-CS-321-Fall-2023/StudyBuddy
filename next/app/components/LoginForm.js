const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  email,
  password
}) => (
  <form
    className='login-form'
    onSubmit={handleLogin}
  >
    <div>
      email
      <input
        id='email'
        type="text"
        value={email}
        name="Email"
        onChange={handleUsernameChange}
      />
    </div>
    <div>
      password
      <input
        id='password'
        type='password'
        value={password}
        name='Password'
        onChange={handlePasswordChange}
      />
    </div>
    <button
      type="submit"
      id='login-button'
    >login</button>
  </form>
)

export default LoginForm