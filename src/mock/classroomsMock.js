const classroomsMock = [
  {
    id: "1",
    name: "Piedmont Primrose-willow",
    initial: "PP",
    activeStatus: false,
    campusId: "3"
  },
  {
    id: "2",
    name: "Summer Grape",
    initial: "SG",
    activeStatus: false,
    campusId: "7"
  },
  {
    id: "3",
    name: "Dot Lichen",
    initial: "DL",
    activeStatus: false,
    campusId: "6"
  },
  {
    id: "4",
    name: "Fineflower Gilia",
    initial: "FG",
    activeStatus: true,
    campusId: "8"
  },
  {
    id: "5",
    name: "Seaside Woolly Sunflower",
    initial: "SWS",
    activeStatus: true,
    campusId: "7"
  },
  {
    id: "6",
    name: "Hybrid Rhododendron",
    initial: "HR",
    activeStatus: true,
    campusId: "8"
  },
  {
    id: "7",
    name: "Torrey's Craglily",
    initial: "TC",
    activeStatus: false,
    campusId: "3"
  },
  {
    id: "8",
    name: "Dot Lichen",
    initial: "DL",
    activeStatus: true,
    campusId: "3"
  },
  {
    id: "9",
    name: "Giant Blue Cohosh",
    initial: "GBC",
    activeStatus: true,
    campusId: "6"
  },
  {
    id: "10",
    name: "Farnoldia Lichen",
    initial: "FL",
    activeStatus: true,
    campusId: "3"
  },
  {
    id: "11",
    name: "White Heath Aster",
    initial: "WHA",
    activeStatus: true,
    campusId: "8"
  },
  {
    id: "12",
    name: "Mustang Grape",
    initial: "MG",
    activeStatus: false,
    campusId: "10"
  },
  {
    id: "13",
    name: "Meadow Fescue",
    initial: "MF",
    activeStatus: true,
    campusId: "6"
  },
  {
    id: "14",
    name: "Snow Indian Paintbrush",
    initial: "SIP",
    activeStatus: true,
    campusId: "6"
  },
  {
    id: "15",
    name: "Strangospora Lichen",
    initial: "SL",
    activeStatus: false,
    campusId: "4"
  },
  {
    id: "16",
    name: "Chaffseed",
    initial: "C",
    activeStatus: true,
    campusId: "2"
  },
  {
    id: "17",
    name: "Illinois Pondweed",
    initial: "IP",
    activeStatus: true,
    campusId: "1"
  },
  {
    id: "18",
    name: "Winter Creeper",
    initial: "WC",
    activeStatus: true,
    campusId: "8"
  },
  {
    id: "19",
    name: "Ajo Xanthoparmelia Lichen",
    initial: "AXL",
    activeStatus: false,
    campusId: "8"
  },
  {
    id: "20",
    name: "Conimitella",
    initial: "C",
    activeStatus: true,
    campusId: "7"
  },
  {
    id: "21",
    name: "Compact Phacelia",
    initial: "CP",
    activeStatus: true,
    campusId: "10"
  },
  {
    id: "22",
    name: "Apetalous Catchfly",
    initial: "AC",
    activeStatus: false,
    campusId: "2"
  },
  {
    id: "23",
    name: "Paiute Suncup",
    initial: "PS",
    activeStatus: false,
    campusId: "5"
  },
  {
    id: "24",
    name: "Felt Lichen",
    initial: "FL",
    activeStatus: true,
    campusId: "7"
  },
  {
    id: "25",
    name: "Alpine Hygrohypnum Moss",
    initial: "AHM",
    activeStatus: true,
    campusId: "10"
  }
];

// var w = "";
// for (const c of classroomsMock) {
//   const initial = c.name.split(" ").map(n => n.substring(0, 1)).join("");
//   console.log(initial);
//   w += `{ id: "${c.id}", name: "${c.name}", initial: "${initial}", activeStatus: ${c.activeStatus}, campusId: "${Math.floor(Math.random() * 10 + 1)}" },\n`
// }
// console.log(w);

export default classroomsMock;
