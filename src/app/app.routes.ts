import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductsComponent } from './pages/products/products.component';
import { ServicesComponent } from './pages/services/services.component';
import { LoginComponent } from './pages/login/login.component';
import { StudentregistrationComponent } from './pages/studentregistration/studentregistration.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UnderConstructionComponent } from './shared/app-under-construction';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { BlogDetailsComponent } from './pages/blogs-details/blogs-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'product', component: ProductsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'student_registration', component: StudentregistrationComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'blogs/:slug', component: BlogDetailsComponent },
  { path: 'under-construction', component: UnderConstructionComponent }

];
