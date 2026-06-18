import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { LOADING_PHRASES } from '../constants/phrases';

export function useAuthFlow({ redirectUrl, navigate, setAuth }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isRbacBlocked, setIsRbacBlocked] = useState(false);
  
  const [tempToken, setTempToken] = useState('');
  const [welcomeState, setWelcomeState] = useState({
    name: '',
    showPhrases: false,
    phraseIndex: 0,
    shuffledPhrases: [],
    isActive: false
  });

  const triggerWelcomeAnimation = useCallback((userIdentifier, payload) => {
    const shuffled = [...LOADING_PHRASES].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    setWelcomeState(prev => ({
      ...prev,
      name: userIdentifier,
      shuffledPhrases: shuffled,
      isActive: true,
      showPhrases: false,
      phraseIndex: 0
    }));

    setTimeout(() => {
      setWelcomeState(prev => ({ ...prev, showPhrases: true }));
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        currentIndex += 1;
        if (currentIndex >= 4) {
          clearInterval(interval);
          
          if (redirectUrl && payload.exchangeCode) {
            window.location.href = `${redirectUrl}?code=${payload.exchangeCode}`;
          } else if (payload.accessToken) {
            setAuth({ username: userIdentifier }, payload.accessToken);
            navigate('/dashboard', { replace: true });
          }
          return;
        }
        setWelcomeState(prev => ({ ...prev, phraseIndex: currentIndex }));
      }, 1500);
    }, 1000);
  }, [navigate, setAuth, redirectUrl]);

  const loginStep1Mutation = useMutation({
    mutationFn: (credentials) => axiosClient.post('/auth/login/step1', {
      ...credentials,
      isRedirect: !!redirectUrl
    }).then(res => res.data),
    onSuccess: (data, variables) => {
      setError('');
      if (data.skip2FA) {
        triggerWelcomeAnimation(variables.username, data);
      } else {
        setTempToken(data.tempToken);
        setStep(2);
      }
    },
    onError: (err) => {
      if (err.response?.data?.code === 'RBAC_BLOCKED') {
        setIsRbacBlocked(true);
      } else {
        setError(err.response?.data?.error || 'Erro de comunicação com o servidor.');
      }
    }
  });

  const loginStep2Mutation = useMutation({
    mutationFn: ({ code }) => axiosClient.post('/auth/login/step2', {
      tempToken,
      code,
      isRedirect: !!redirectUrl
    }).then(res => res.data),
    onSuccess: (data, variables) => {
      setError('');
      triggerWelcomeAnimation(variables.username, data);
    },
    onError: (err) => {
      if (err.response?.data?.code === 'RBAC_BLOCKED') {
        setIsRbacBlocked(true);
      } else {
        setError(err.response?.data?.error || 'Código inválido ou sessão expirada.');
        if (err.response?.data?.error?.includes('expirou')) {
          setStep(1);
        }
      }
    }
  });

  const resetFlow = useCallback(() => {
    setStep(1);
    setError('');
    setIsRbacBlocked(false);
    setTempToken('');
  }, []);

  return {
    state: { step, error, isRbacBlocked, welcomeState },
    mutations: { loginStep1: loginStep1Mutation, loginStep2: loginStep2Mutation },
    actions: { resetFlow, setError, setIsRbacBlocked }
  };
}