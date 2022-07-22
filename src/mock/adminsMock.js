const adminsMock = [
  {
    id: "1",
    username: "kalekseev0",
    firstName: "Kirk",
    lastName: "Alekseev",
    emailBbs: "kalekseev0@usnews.com",
    campusAccess: 2,
    pageAccessId: 5,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-07-06T14:31:11Z"
  },
  {
    id: "2",
    username: "ccurthoys1",
    firstName: "Corrie",
    lastName: "Curthoys",
    emailBbs: "ccurthoys1@storify.com",
    campusAccess: 2,
    pageAccessId: 3,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-04-30T21:41:31Z"
  },
  {
    id: "3",
    username: "bchampkin2",
    firstName: "Bondy",
    lastName: "Champkin",
    emailBbs: "bchampkin2@cam.ac.uk",
    campusAccess: 3,
    pageAccessId: 2,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-11-18T00:17:39Z"
  },
  {
    id: "4",
    username: "cmacfarlane3",
    firstName: "Cristiano",
    lastName: "MacFarlane",
    emailBbs: "cmacfarlane3@apple.com",
    campusAccess: 1,
    pageAccessId: 4,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: true,
    lastAccessedAt: "2022-02-05T21:08:33Z"
  },
  {
    id: "5",
    username: "ehissett4",
    firstName: "Evin",
    lastName: "Hissett",
    emailBbs: "ehissett4@wikimedia.org",
    campusAccess: 3,
    pageAccessId: 1,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: true,
    lastAccessedAt: "2021-02-09T18:08:09Z"
  },
  {
    id: "6",
    username: "dwillmot5",
    firstName: "Dominique",
    lastName: "Willmot",
    emailBbs: "dwillmot5@house.gov",
    campusAccess: 2,
    pageAccessId: 3,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: true,
    lastAccessedAt: "2021-09-20T00:02:42Z"
  },
  {
    id: "7",
    username: "pscandrite6",
    firstName: "Pegeen",
    lastName: "Scandrite",
    emailBbs: "pscandrite6@rediff.com",
    campusAccess: 1,
    pageAccessId: 1,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-09-05T09:52:49Z"
  },
  {
    id: "8",
    username: "imcguckin7",
    firstName: "Isak",
    lastName: "McGuckin",
    emailBbs: "imcguckin7@ted.com",
    campusAccess: 2,
    pageAccessId: 1,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-12-01T15:54:16Z"
  },
  {
    id: "9",
    username: "jakett8",
    firstName: "Julian",
    lastName: "Akett",
    emailBbs: "jakett8@symantec.com",
    campusAccess: 1,
    pageAccessId: 3,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-11-08T22:03:38Z"
  },
  {
    id: "10",
    username: "bcrier9",
    firstName: "Bobina",
    lastName: "Crier",
    emailBbs: "bcrier9@nps.gov",
    campusAccess: 1,
    pageAccessId: 4,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: true,
    lastAccessedAt: "2021-11-12T09:45:57Z"
  },
  {
    id: "11",
    username: "ckienlea",
    firstName: "Corenda",
    lastName: "Kienle",
    emailBbs: "ckienlea@sciencedaily.com",
    campusAccess: 2,
    pageAccessId: 5,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2022-01-21T04:17:58Z"
  },
  {
    id: "12",
    username: "ebarochb",
    firstName: "Ebba",
    lastName: "Baroch",
    emailBbs: "ebarochb@trellian.com",
    campusAccess: 2,
    pageAccessId: 4,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: true,
    lastAccessedAt: "2021-03-05T22:58:38Z"
  },
  {
    id: "13",
    username: "dfrancklinc",
    firstName: "Dorothy",
    lastName: "Francklin",
    emailBbs: "dfrancklinc@webs.com",
    campusAccess: 1,
    pageAccessId: 1,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: true,
    lastAccessedAt: "2021-07-19T21:31:06Z"
  },
  {
    id: "14",
    username: "cwimpeneyd",
    firstName: "Cinnamon",
    lastName: "Wimpeney",
    emailBbs: "cwimpeneyd@mayoclinic.com",
    campusAccess: 2,
    pageAccessId: 5,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: true,
    lastAccessedAt: "2021-12-26T19:24:02Z"
  },
  {
    id: "15",
    username: "eroskamse",
    firstName: "Emmeline",
    lastName: "Roskams",
    emailBbs: "eroskamse@cbc.ca",
    campusAccess: 3,
    pageAccessId: 3,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-08-19T07:12:11Z"
  },
  {
    id: "16",
    username: "epracyf",
    firstName: "El",
    lastName: "Pracy",
    emailBbs: "epracyf@theguardian.com",
    campusAccess: 1,
    pageAccessId: 1,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: true,
    lastAccessedAt: "2021-02-11T21:49:56Z"
  },
  {
    id: "17",
    username: "lgrubbg",
    firstName: "Lamar",
    lastName: "Grubb",
    emailBbs: "lgrubbg@va.gov",
    campusAccess: 1,
    pageAccessId: 5,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-02-14T17:16:29Z"
  },
  {
    id: "18",
    username: "ppecheth",
    firstName: "Peyton",
    lastName: "Pechet",
    emailBbs: "ppecheth@flavors.me",
    campusAccess: 1,
    pageAccessId: 3,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-09-29T23:09:30Z"
  },
  {
    id: "19",
    username: "ttarbardi",
    firstName: "Terry",
    lastName: "Tarbard",
    emailBbs: "ttarbardi@vinaora.com",
    campusAccess: 1,
    pageAccessId: 3,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-10-15T22:20:05Z"
  },
  {
    id: "20",
    username: "tnunnsj",
    firstName: "Ted",
    lastName: "Nunns",
    emailBbs: "tnunnsj@china.com.cn",
    campusAccess: 1,
    pageAccessId: 4,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-06-28T14:04:18Z"
  },
  {
    id: "21",
    username: "breichertk",
    firstName: "Bonny",
    lastName: "Reichert",
    emailBbs: "breichertk@geocities.jp",
    campusAccess: 2,
    pageAccessId: 1,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: true,
    lastAccessedAt: "2021-06-01T17:13:15Z"
  },
  {
    id: "22",
    username: "arobertl",
    firstName: "Arny",
    lastName: "Robert",
    emailBbs: "arobertl@chron.com",
    campusAccess: 2,
    pageAccessId: 4,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: true,
    lastAccessedAt: "2021-08-31T16:14:36Z"
  },
  {
    id: "23",
    username: "cjilesm",
    firstName: "Clarie",
    lastName: "Jiles",
    emailBbs: "cjilesm@bigcartel.com",
    campusAccess: 3,
    pageAccessId: 4,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: true,
    lastAccessedAt: "2021-08-05T21:27:42Z"
  },
  {
    id: "24",
    username: "aroscamn",
    firstName: "Artus",
    lastName: "Roscam",
    emailBbs: "aroscamn@dagondesign.com",
    campusAccess: 3,
    pageAccessId: 4,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-04-10T16:24:42Z"
  },
  {
    id: "25",
    username: "mturbillo",
    firstName: "Manuel",
    lastName: "Turbill",
    emailBbs: "mturbillo@homestead.com",
    campusAccess: 1,
    pageAccessId: 4,
    pageAccess: {
      canViewAdmins: true,
      canViewUser: true,
      canViewStudents: true
    },
    activeStatus: false,
    lastAccessedAt: "2021-03-29T23:24:56Z"
  }
];

export default adminsMock;
