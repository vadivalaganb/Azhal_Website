import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductsComponent } from './pages/products/products.component';
import { FeaturesComponent } from './pages/blogs/features/features.component';
import { TeamComponent } from './pages/blogs/team/team.component';
import { TestimonialComponent } from './pages/blogs/testimonial/testimonial.component';
import { ServicesComponent } from './pages/services/services.component';
import { AccountRegistrationComponent } from './pages/account-registration/account-registration.component';
import { ProfileRegistrationComponent } from './pages/profile-registration/profile-registration.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'product', component: ProductsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'account-registration', component: AccountRegistrationComponent },
  { path: 'app-profile-registration', component: ProfileRegistrationComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'team', component: TeamComponent },
  { path: 'testimonial', component: TestimonialComponent },
  { path: 'login', component: LoginComponent },
];
