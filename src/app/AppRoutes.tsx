import React from "react";
import { createHashRouter, Outlet } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Explore } from "./components/Explore";
import { Artists } from "./components/Artists";
import { ArtistProfile } from "./components/ArtistProfile";
import { Disciplines } from "./components/Disciplines";
import { About } from "./components/About";
import { PublishProcess } from "./components/PublishProcess";
import { MyProfile } from "./components/MyProfile";
import { NotFound } from "./components/NotFound";
import { DisciplineMusic } from "./components/DisciplineMusic";
import { DisciplinePhoto } from "./components/DisciplinePhoto";
import { DisciplineDanza } from "./components/DisciplineDanza";
import { DisciplineArtesPlasticas } from "./components/DisciplineArtesPlasticas";
import { DisciplineEscritura } from "./components/DisciplineEscritura";
import { DisciplineDisenoGrafico } from "./components/DisciplineDisenoGrafico";
import { AuthPage } from "./components/AuthPage";

export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "explorar", Component: Explore },
      { path: "artistas", Component: Artists },
      { path: "artistas/:id", Component: ArtistProfile },
      { path: "disciplinas", Component: Disciplines },
      { path: "disciplinas/musica", Component: DisciplineMusic },
      { path: "disciplinas/fotografia-filmmaking", Component: DisciplinePhoto },
      { path: "disciplinas/danza", Component: DisciplineDanza },
      { path: "disciplinas/artes-plasticas", Component: DisciplineArtesPlasticas },
      { path: "disciplinas/escritura", Component: DisciplineEscritura },
      { path: "disciplinas/diseno-grafico-ilustracion", Component: DisciplineDisenoGrafico },
      { path: "sobre-el-proceso", Component: About },
      { path: "publicar-proceso", Component: PublishProcess },
      { path: "mi-perfil", Component: MyProfile },
      { path: "auth", Component: AuthPage },
      { path: "*", Component: NotFound },
    ],
  },
]);
