import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 3,
    title: "Docs",
    newTab: false,
    path: "/docs",
  },
  {
    id: 5,
    title: "Monstra Bots",
    newTab: false,
    submenu: [
      {
        id: 51,
        title: "Bellator",
        newTab: false,
        path: "/bots/bellator",
      },
      {
        id: 52,
        title: "Cyclus",
        newTab: false,
        path: "/bots/cyclus",
      },
      {
        id: 53,
        title: "Imperium",
        newTab: false,
        path: "/bots/imperium",
      },
      {
        id: 54,
        title: "Medicus",
        newTab: false,
        path: "/bots/medicus",
      },
      {
        id: 55,
        title: "Vectūra",
        newTab: false,
        path: "/bots/vectura",
      },
      {
        id: 56,
        title: "Viator",
        newTab: false,
        path: "/bots/viator",
      },
      {
        id: 57,
        title: "Vis",
        newTab: false,
        path: "/bots/vis",
      },
    ],
  },
];

export default menuData;
