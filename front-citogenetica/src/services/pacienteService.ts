// src/services/pacienteService.ts

import apiClient from '../axiosConfig';

/**
 * Busca paciente por CPF ou número SUS
 */
export const buscarPacientePorCpfOuSus = (termo: string) => {
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
 * Busca paciente especificamente por número SUS
 */
export const buscarPacientePorNumeroSus = (numeroSus: string) => {
  return apiClient.get(`/pacientes/buscar/sus/${numeroSus}`);
};

export default {
  buscarPacientePorCpfOuSus,
  buscarPacientePorCpf,
  buscarPacientePorNumeroSus,
};