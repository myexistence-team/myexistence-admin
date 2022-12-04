export const SCHOOL_TYPES = {
  "ELEMENTARY_SCHOOL": "Sekolah Dasar (SD)",
  "MIDDLE_SCHOOL": "Sekolah Menengah Pertama (SMP)",
  "HIGH_SCHOOL": "Sekolah Menengah Atas (SMA)",
  "COLLEGE": "Universitas",
  "TUTOR": "Bimbingan Belajar",
}

export const ROLE_TYPES = {
  "SUPER_ADMIN": "Super Administrator",
  ADMIN: "Administrator",
  TEACHER: "Pengajar",
  STUDENT: "Pelajar"
}

export const ATTENDANCE_STATUS_ENUM = {
  PRESENT: "Hadir",
  LATE: "Terlambat",
  EXCUSED: "Izin",
  ABSENT: "Absen"
}

export const EXCUSE_TYPE_ENUM = {
  SICK: "Sakit",
  OTHER: "Lainnya",
}

export const SCHEDULE_OPEN_METHODS_ENUM = {
  QR_CODE: "QR Code",
  CALLOUT: "Panggil Pelajar",
  GEOLOCATION: "Deteksi Lokasi",
}

export const EXCUSE_STATUS_ENUM = {
  WAITING: "Menunggu Konfirmasi",
  REJECTED: "Ditolak",
  ACCEPTED: "Diterima"
}