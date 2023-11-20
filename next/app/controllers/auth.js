import authService from '@/app/services/auth';

  const login = async credentials => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
  
    const response = await authService.login(options)

    return response;
  }

  const register = async credentials => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    
    const response = await authService.register(options)
  
    return response;
  }

export default { login, register }