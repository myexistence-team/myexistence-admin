const classInYearsMock = [
  {
    id: "1",
    programme: "PS",
    classroomId: "8",
    teacherId: "4",
    academicYearId: "4",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "5"]
  },
  {
    id: "2",
    programme: "JC",
    classroomId: "1",
    teacherId: "5",
    academicYearId: "3",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "3",
    programme: "JC",
    classroomId: "1",
    teacherId: "4",
    academicYearId: "2",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "4",
    programme: "JC",
    classroomId: "3",
    teacherId: "4",
    academicYearId: "1",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "5",
    programme: "JC",
    classroomId: "4",
    teacherId: "5",
    academicYearId: "3",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2", "1", "4"]
  },
  {
    id: "6",
    programme: "P",
    classroomId: "6",
    teacherId: "5",
    academicYearId: "2",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "7",
    programme: "JC",
    classroomId: "6",
    teacherId: "4",
    academicYearId: "4",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "8",
    programme: "JC",
    classroomId: "8",
    teacherId: "4",
    academicYearId: "2",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "9",
    programme: "P",
    classroomId: "7",
    teacherId: "5",
    academicYearId: "5",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "10",
    programme: "PS",
    classroomId: "8",
    teacherId: "4",
    academicYearId: "5",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "11",
    programme: "JC",
    classroomId: "6",
    teacherId: "4",
    academicYearId: "4",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "12",
    programme: "JC",
    classroomId: "5",
    teacherId: "5",
    academicYearId: "3",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "13",
    programme: "JC",
    classroomId: "4",
    teacherId: "4",
    academicYearId: "2",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "14",
    programme: "JC",
    classroomId: "8",
    teacherId: "5",
    academicYearId: "5",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "15",
    programme: "JC",
    classroomId: "3",
    teacherId: "5",
    academicYearId: "5",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "16",
    programme: "PS",
    classroomId: "2",
    teacherId: "4",
    academicYearId: "4",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "17",
    programme: "JC",
    classroomId: "5",
    teacherId: "4",
    academicYearId: "3",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "18",
    programme: "S",
    classroomId: "3",
    teacherId: "4",
    academicYearId: "5",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "19",
    programme: "PS",
    classroomId: "7",
    teacherId: "4",
    academicYearId: "3",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "20",
    programme: "JC",
    classroomId: "4",
    teacherId: "5",
    academicYearId: "2",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "21",
    programme: "S",
    classroomId: "6",
    teacherId: "4",
    academicYearId: "1",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "22",
    programme: "S",
    classroomId: "4",
    teacherId: "5",
    academicYearId: "4",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "23",
    programme: "JC",
    classroomId: "7",
    teacherId: "4",
    academicYearId: "2",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "24",
    programme: "JC",
    classroomId: "7",
    teacherId: "4",
    academicYearId: "3",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "25",
    programme: "JC",
    classroomId: "7",
    teacherId: "5",
    academicYearId: "5",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "26",
    programme: "JC",
    classroomId: "6",
    teacherId: "5",
    academicYearId: "4",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "27",
    programme: "PS",
    classroomId: "2",
    teacherId: "5",
    academicYearId: "1",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "28",
    programme: "JC",
    classroomId: "4",
    teacherId: "5",
    academicYearId: "4",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "29",
    programme: "P",
    classroomId: "2",
    teacherId: "5",
    academicYearId: "1",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "30",
    programme: "JC",
    classroomId: "1",
    teacherId: "4",
    academicYearId: "3",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "31",
    programme: "JC",
    classroomId: "6",
    teacherId: "4",
    academicYearId: "2",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "32",
    programme: "S",
    classroomId: "6",
    teacherId: "4",
    academicYearId: "4",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "33",
    programme: "JC",
    classroomId: "3",
    teacherId: "4",
    academicYearId: "4",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "34",
    programme: "JC",
    classroomId: "4",
    teacherId: "5",
    academicYearId: "1",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "35",
    programme: "P",
    classroomId: "6",
    teacherId: "5",
    academicYearId: "3",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "36",
    programme: "S",
    classroomId: "7",
    teacherId: "4",
    academicYearId: "2",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "37",
    programme: "P",
    classroomId: "7",
    teacherId: "5",
    academicYearId: "3",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "38",
    programme: "PS",
    classroomId: "2",
    teacherId: "5",
    academicYearId: "1",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "39",
    programme: "P",
    classroomId: "7",
    teacherId: "4",
    academicYearId: "3",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "40",
    programme: "P",
    classroomId: "6",
    teacherId: "5",
    academicYearId: "1",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "41",
    programme: "JC",
    classroomId: "1",
    teacherId: "4",
    academicYearId: "1",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "42",
    programme: "JC",
    classroomId: "2",
    teacherId: "5",
    academicYearId: "1",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "43",
    programme: "JC",
    classroomId: "2",
    teacherId: "4",
    academicYearId: "3",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "44",
    programme: "P",
    classroomId: "8",
    teacherId: "5",
    academicYearId: "3",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "45",
    programme: "S",
    classroomId: "6",
    teacherId: "4",
    academicYearId: "3",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "46",
    programme: "S",
    classroomId: "8",
    teacherId: "5",
    academicYearId: "4",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "47",
    programme: "JC",
    classroomId: "7",
    teacherId: "4",
    academicYearId: "3",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "48",
    programme: "S",
    classroomId: "5",
    teacherId: "4",
    academicYearId: "2",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "49",
    programme: "P",
    classroomId: "2",
    teacherId: "5",
    academicYearId: "4",
    activeStatus: "ACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  },
  {
    id: "50",
    programme: "S",
    classroomId: "4",
    teacherId: "5",
    academicYearId: "4",
    activeStatus: "INACTIVE",
    level: "KINDERGARTEN1",
    subjectIds: ["3", "2"]
  }
];

export default classInYearsMock;
