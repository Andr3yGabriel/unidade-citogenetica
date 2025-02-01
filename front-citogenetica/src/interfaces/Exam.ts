export interface Exam {
    id: number,
    type: string,
    subtype: string,
    patient_document: string,
    doctor_document: string,
    exam_date: Date,
    file: string,
    patient_name: string,
    status: string,
}