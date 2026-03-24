// src/services/pacienteService.ts

import apiClient from '../axiosConfig';

/**
 * Busca paciente por CPF ou número SES
 */
export const buscarPacientePorCpfOuSes = (termo: string) => {
  return apiClient.get(`/pacientes/buscar`, {
    params: { termo }
  });
};

/**
 * Busca paciente especificamente por CPF
 */
export const buscarPacientePorCpf = (cpf: string) => {
  return apiClient.get(`/pacientes/buscar/cpf/${cpf}`);
};

/**
 * Busca paciente especificamente por número SES
 */
export const buscarPacientePorNumeroSes = (numeroSes: string) => {
  return apiClient.get(`/pacientes/buscar/ses/${numeroSes}`);
};

export default {
  buscarPacientePorCpfOuSes,
  buscarPacientePorCpf,
  buscarPacientePorNumeroSes,
};