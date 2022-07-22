const parentsMock = [
  {
    id: "1",
    name: "Pembroke Borghese",
    phoneNumber: "+1 876 205 7740",
    email: "pborghese0@tamu.edu",
    nationality: "CA",
    campusId: "1"
  },
  {
    id: "2",
    name: "Katerina Easterfield",
    phoneNumber: "+54 411 402 5536",
    email: "keasterfield1@so-net.ne.jp",
    nationality: "AR",
    campusId: "1"
  },
  {
    id: "3",
    name: "Ariel O'Grady",
    phoneNumber: "+62 678 159 9027",
    email: "aogrady2@dropbox.com",
    nationality: "ID",
    campusId: "1"
  },
  {
    id: "4",
    name: "Ilyssa Lukasen",
    phoneNumber: "+63 334 433 6531",
    email: "ilukasen3@youtu.be",
    nationality: "PH",
    campusId: "1"
  },
  {
    id: "5",
    name: "Bambi Baccus",
    phoneNumber: "+375 184 590 8679",
    email: "bbaccus4@unc.edu",
    nationality: "BY",
    campusId: "2"
  },
  {
    id: "6",
    name: "Tye Corgenvin",
    phoneNumber: "+62 300 135 2437",
    email: "tcorgenvin5@fotki.com",
    nationality: "ID",
    campusId: "2"
  },
  {
    id: "7",
    name: "Francyne Rollinshaw",
    phoneNumber: "+63 480 835 5983",
    email: "frollinshaw6@msu.edu",
    nationality: "PH",
    campusId: "1"
  },
  {
    id: "8",
    name: "Nalani Jacox",
    phoneNumber: "+504 538 282 9278",
    email: "njacox7@intel.com",
    nationality: "HN",
    campusId: "1"
  },
  {
    id: "9",
    name: "Nollie Beales",
    phoneNumber: "+81 744 175 9569",
    email: "nbeales8@paginegialle.it",
    nationality: "JP",
    campusId: "1"
  },
  {
    id: "10",
    name: "Alis Boon",
    phoneNumber: "+507 481 521 2608",
    email: "aboon9@ucoz.ru",
    nationality: "PA",
    campusId: "2"
  },
  {
    id: "11",
    name: "Gates Edmons",
    phoneNumber: "+81 293 140 4341",
    email: "gedmonsa@netvibes.com",
    nationality: "JP",
    campusId: "2"
  },
  {
    id: "12",
    name: "Brenn Atmore",
    phoneNumber: "+86 272 682 1880",
    email: "batmoreb@google.fr",
    nationality: "CN",
    campusId: "2"
  },
  {
    id: "13",
    name: "Ernesto Schimann",
    phoneNumber: "+351 667 656 8574",
    email: "eschimannc@cocolog-nifty.com",
    nationality: "PT",
    campusId: "1"
  },
  {
    id: "14",
    name: "Jacques Tidmarsh",
    phoneNumber: "+33 495 958 2048",
    email: "jtidmarshd@who.int",
    nationality: "FR",
    campusId: "1"
  },
  {
    id: "15",
    name: "Fancy Dicty",
    phoneNumber: "+86 466 753 3565",
    email: "fdictye@oakley.com",
    nationality: "CN",
    campusId: "1"
  },
  {
    id: "16",
    name: "Malinde Zelley",
    phoneNumber: "+46 330 424 8775",
    email: "mzelleyf@zdnet.com",
    nationality: "SE",
    campusId: "2"
  },
  {
    id: "17",
    name: "Gale Coiley",
    phoneNumber: "+670 422 514 3430",
    email: "gcoileyg@wiley.com",
    nationality: "TL",
    campusId: "1"
  },
  {
    id: "18",
    name: "Kermy McShane",
    phoneNumber: "+7 436 597 1735",
    email: "kmcshaneh@tripadvisor.com",
    nationality: "KZ",
    campusId: "2"
  },
  {
    id: "19",
    name: "Hakim Crowcher",
    phoneNumber: "+46 388 258 1501",
    email: "hcrowcheri@hugedomains.com",
    nationality: "SE",
    campusId: "2"
  },
  {
    id: "20",
    name: "Roselia Wison",
    phoneNumber: "+48 600 754 7036",
    email: "rwisonj@jiathis.com",
    nationality: "PL",
    campusId: "2"
  },
  {
    id: "21",
    name: "Free Cosley",
    phoneNumber: "+86 445 418 8513",
    email: "fcosleyk@canalblog.com",
    nationality: "CN",
    campusId: "2"
  },
  {
    id: "22",
    name: "Fidelio Lordon",
    phoneNumber: "+62 577 611 1730",
    email: "flordonl@rakuten.co.jp",
    nationality: "ID",
    campusId: "2"
  },
  {
    id: "23",
    name: "Nolie Grishaev",
    phoneNumber: "+237 886 566 1582",
    email: "ngrishaevm@myspace.com",
    nationality: "CM",
    campusId: "1"
  },
  {
    id: "24",
    name: "Bay Radke",
    phoneNumber: "+995 946 176 8451",
    email: "bradken@yahoo.com",
    nationality: "GE",
    campusId: "2"
  },
  {
    id: "25",
    name: "Tommie Bolus",
    phoneNumber: "+7 784 666 2883",
    email: "tboluso@hhs.gov",
    nationality: "RU",
    campusId: "1"
  },
  {
    id: "26",
    name: "Benton O' Donohoe",
    phoneNumber: "+1 827 986 7276",
    email: "bop@constantcontact.com",
    nationality: "CA",
    campusId: "2"
  },
  {
    id: "27",
    name: "Lorin Fackrell",
    phoneNumber: "+7 402 969 2624",
    email: "lfackrellq@simplemachines.org",
    nationality: "KZ",
    campusId: "1"
  },
  {
    id: "28",
    name: "Marylinda Lewsey",
    phoneNumber: "+62 395 337 6497",
    email: "mlewseyr@furl.net",
    nationality: "ID",
    campusId: "1"
  },
  {
    id: "29",
    name: "Brooks Veal",
    phoneNumber: "+86 171 795 5752",
    email: "bveals@indiegogo.com",
    nationality: "CN",
    campusId: "2"
  },
  {
    id: "30",
    name: "Sileas Neads",
    phoneNumber: "+86 785 935 5311",
    email: "sneadst@vimeo.com",
    nationality: "CN",
    campusId: "1"
  }
];

export default parentsMock;
