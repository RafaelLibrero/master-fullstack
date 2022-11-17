import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from "./components/home/home.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { UserEditComponent } from "./components/user-edit/user-edit.component";
import { VideoNewComponent } from "./components/video-new/video-new.component";
import { VideoEditComponent } from "./components/video-edit/video-edit.component";
import { VideoDetailComponent } from "./components/video-detail/video-detail.component";

import { ErrorComponent } from "./components/error/error.component";

import { IdentityGuard } from "./services/identity.guard";

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'home/:page', component: HomeComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'logout/:sure', component: LoginComponent},
    {path: 'ajustes', component: UserEditComponent, canActivate: [IdentityGuard]},
    {path: 'guardar', component: VideoNewComponent, canActivate: [IdentityGuard]},
    {path: 'editar/:id', component: VideoEditComponent, canActivate: [IdentityGuard]},
    {path: 'video/:id', component: VideoDetailComponent, canActivate: [IdentityGuard]},
    {path: 'error', component: ErrorComponent},
    {path: '**', component: ErrorComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);