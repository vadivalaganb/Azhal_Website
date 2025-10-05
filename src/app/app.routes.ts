import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductsComponent } from './pages/products/products.component';
import { FeaturesComponent } from './pages/blogs/features/features.component';
import { TeamComponent } from './pages/blogs/team/team.component';
import { TestimonialComponent } from './pages/blogs/testimonial/testimonial.component';
import { ServicesComponent } from './pages/services/services.component';
import { LoginComponent } from './pages/login/login.component';
import { StudentregistrationComponent } from './pages/studentregistration/studentregistration.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UnderConstructionComponent } from './shared/app-under-construction';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'product', component: ProductsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'team', component: TeamComponent },
  { path: 'testimonial', component: TestimonialComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'student_registration', component: StudentregistrationComponent },
  { path: 'under-construction', component: UnderConstructionComponent }

];
