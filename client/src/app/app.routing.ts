import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

//Import componentes de usuario
import { UserEditComponent } from './components/user-edit.component'

//definicion de rutas
const appRoutes: Routes = [
    { path: '', component: UserEditComponent },
    { path: 'mis-datos', component: UserEditComponent },
    { path: '**', component: UserEditComponent },
]

export const appRoutingProviders: any[] = []
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes)