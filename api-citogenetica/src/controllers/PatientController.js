const Patient = require('../models/Patient');
const { generateToken } = require('../services');

class PatientController {
    static async Register(req, res) {
        try {
            const { completeName, password, email, document } = req.body;
            console.log('Dados recebidos para registro de paciente:', { completeName, password, email, document });
            const existingPatient = await Patient.findOne({ where: { document } });
            if (existingPatient) {
                return res.status(400).json({ message: 'Paciente com esse CPF já existe!' });
            }

            const newPatient = await Patient.create({ completeName, password, email, document });
            const token = generateToken({ document: newPatient.document, type: 'patient', expiresIn: '1h' });

            res.status(201).json({ message: 'Paciente registrado com sucesso!', token });
        } catch (error) {
            console.error('Erro durante registro do paciente:', error);
            res.status(500).json({ message: 'Erro inesperado ao realizar registro: ', error });
        }
    }

    static async Login(req, res) {
        try {
            const { document, password } = req.body;

            const patient = await Patient.findOne({ where: { document } });

            if (!patient) {
                return res.status(404).json({ message: 'Paciente não encontrado!' });
            }

            const isPasswordValid = await patient.validatePassword(password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Credenciais inválidas!' });
            }

            const token = generateToken({ document: patient.document, type: 'patient', expiresIn: '1h' });
            res.status(200).json({ message: 'Login feito com sucesso!', token });
        } catch (error) {
            console.error('Erro durante o login:', error);
            res.status(500).json({ message: 'Erro inesperado durante o login! ', error });
        }
    }
}

module.exports = PatientController;
