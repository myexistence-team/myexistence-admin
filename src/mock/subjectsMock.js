const subjectsMock = [
  {
    id: "1",
    subjectName: "Music",
    subjectCode: "RHGR",
    subjectType: "Academic",
    activeStatus: "Active",
    level: "12",
    campusId: "2",
    category: "Active",
    priority: 1
  },
  {
    id: "2",
    subjectName: "Chemistry",
    subjectCode: "DBNJ",
    subjectType: "Academic",
    activeStatus: "Inactive",
    level: "11",
    campusId: "1",
    category: "Inactive",
    priority: 9
  },
  {
    id: "3",
    subjectName: "Math",
    subjectCode: "DXIL",
    subjectType: "Academic",
    activeStatus: "Inactive",
    level: "11",
    campusId: "1",
    category: "Active",
    priority: 8
  },
  {
    id: "4",
    subjectName: "Chemistry",
    subjectCode: "XNWM",
    subjectType: "Academic",
    activeStatus: "Active",
    level: "3",
    campusId: "2",
    category: "Inactive",
    priority: 0
  },
  {
    id: "5",
    subjectName: "Physics",
    subjectCode: "JBIB",
    subjectType: "Academic",
    activeStatus: "Active",
    level: "4",
    campusId: "1",
    category: "Inactive",
    priority: 3
  },
  {
    id: "6",
    subjectName: "Chemistry",
    subjectCode: "OOZU",
    subjectType: "Non-Academic",
    activeStatus: "Active",
    level: "5",
    campusId: "1",
    category: "Inactive",
    priority: 3
  },
  {
    id: "7",
    subjectName: "Chemistry",
    subjectCode: "MYLM",
    subjectType: "Non-Academic",
    activeStatus: "Active",
    level: "1",
    campusId: "1",
    category: "Inactive",
    priority: 9
  },
  {
    id: "8",
    subjectName: "Physics",
    subjectCode: "QEYU",
    subjectType: "Academic",
    activeStatus: "Inactive",
    level: "9",
    campusId: "2",
    category: "Active",
    priority: 2
  },
  {
    id: "9",
    subjectName: "Chemistry",
    subjectCode: "VLXM",
    subjectType: "Academic",
    activeStatus: "Active",
    level: "8",
    campusId: "2",
    category: "Active",
    priority: 5
  },
  {
    id: "10",
    subjectName: "Chemistry",
    subjectCode: "WHBP",
    subjectType: "Non-Academic",
    activeStatus: "Inactive",
    level: "10",
    campusId: "2",
    category: "Active",
    priority: 2
  },
  {
    id: "11",
    subjectName: "Physics",
    subjectCode: "PZHH",
    subjectType: "Non-Academic",
    activeStatus: "Inactive",
    level: "12",
    campusId: "1",
    category: "Inactive",
    priority: 8
  },
  {
    id: "12",
    subjectName: "Chemistry",
    subjectCode: "EYRA",
    subjectType: "Non-Academic",
    activeStatus: "Active",
    level: "3",
    campusId: "2",
    category: "Inactive",
    priority: 3
  },
  {
    id: "13",
    subjectName: "Chemistry",
    subjectCode: "VXWX",
    subjectType: "Non-Academic",
    activeStatus: "Inactive",
    level: "1",
    campusId: "2",
    category: "Inactive",
    priority: 9
  },
  {
    id: "14",
    subjectName: "Music",
    subjectCode: "PPHD",
    subjectType: "Non-Academic",
    activeStatus: "Active",
    level: "10",
    campusId: "2",
    category: "Active",
    priority: 1
  },
  {
    id: "15",
    subjectName: "Physics",
    subjectCode: "ALSU",
    subjectType: "Non-Academic",
    activeStatus: "Active",
    level: "9",
    campusId: "2",
    category: "Active",
    priority: 3
  },
  {
    id: "16",
    subjectName: "Music",
    subjectCode: "OAKL",
    subjectType: "Non-Academic",
    activeStatus: "Active",
    level: "4",
    campusId: "2",
    category: "Active",
    priority: 2
  },
  {
    id: "17",
    subjectName: "Biology",
    subjectCode: "NZFF",
    subjectType: "Academic",
    activeStatus: "Inactive",
    level: "8",
    campusId: "2",
    category: "Inactive",
    priority: 0
  },
  {
    id: "18",
    subjectName: "Chemistry",
    subjectCode: "WTAA",
    subjectType: "Non-Academic",
    activeStatus: "Inactive",
    level: "4",
    campusId: "2",
    category: "Active",
    priority: 6
  },
  {
    id: "19",
    subjectName: "Chemistry",
    subjectCode: "NYRF",
    subjectType: "Non-Academic",
    activeStatus: "Inactive",
    level: "12",
    campusId: "2",
    category: "Active",
    priority: 4
  },
  {
    id: "20",
    subjectName: "Music",
    subjectCode: "OVVA",
    subjectType: "Non-Academic",
    activeStatus: "Inactive",
    level: "10",
    campusId: "2",
    category: "Inactive",
    priority: 6
  },
  {
    id: "21",
    subjectName: "Chemistry",
    subjectCode: "TMZK",
    subjectType: "Academic",
    activeStatus: "Active",
    level: "12",
    campusId: "2",
    category: "Active",
    priority: 2
  },
  {
    id: "22",
    subjectName: "Physics",
    subjectCode: "GBDZ",
    subjectType: "Non-Academic",
    activeStatus: "Inactive",
    level: "3",
    campusId: "1",
    category: "Inactive",
    priority: 5
  },
  {
    id: "23",
    subjectName: "Physics",
    subjectCode: "SPFK",
    subjectType: "Academic",
    activeStatus: "Inactive",
    level: "4",
    campusId: "1",
    category: "Inactive",
    priority: 4
  },
  {
    id: "24",
    subjectName: "Chemistry",
    subjectCode: "FWTG",
    subjectType: "Non-Academic",
    activeStatus: "Inactive",
    level: "6",
    campusId: "2",
    category: "Inactive",
    priority: 6
  },
  {
    id: "25",
    subjectName: "Music",
    subjectCode: "OIIM",
    subjectType: "Non-Academic",
    activeStatus: "Active",
    level: "8",
    campusId: "1",
    category: "Active",
    priority: 5
  }
];

export default subjectsMock;
