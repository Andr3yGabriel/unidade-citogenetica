export interface Exam {
    id: number,
    type: string,
    subtype: string,
    patientDocument: string,
    doctorDocument: string,
    registrationDate: Date,
    resultFile: string,
    patientName: string,
    status: string,
}