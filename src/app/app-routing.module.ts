import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./info/info.module').then( m => m.InfoPageModule)
  },
  {
    path: 'my-journeys',
    loadChildren: () => import('./my-journeys/my-journeys.module').then( m => m.MyJourneysPageModule)
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./payment-methods/payment-methods.module').then( m => m.PaymentMethodsPageModule)
  },
  {
    path: 'invite-friends',
    loadChildren: () => import('./invite-friends/invite-friends.module').then( m => m.InviteFriendsPageModule)
  },
  {
    path: 'discount-codes',
    loadChildren: () => import('./discount-codes/discount-codes.module').then( m => m.DiscountCodesPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./select-language/select-language.module').then( m => m.SelectLanguagePageModule)
  },
  {
    path: 'welcome-note',
    loadChildren: () => import('./welcome-note/welcome-note.module').then( m => m.WelcomeNotePageModule)
  },
  {
    path: 'via-phone',
    loadChildren: () => import('./via-phone/via-phone.module').then( m => m.ViaPhonePageModule)
  },
  {
    path: 'via-email',
    loadChildren: () => import('./via-email/via-email.module').then( m => m.ViaEmailPageModule)
  },
  {
    path: 'otp-verification',
    loadChildren: () => import('./otp-verification/otp-verification.module').then( m => m.OtpVerificationPageModule)
  },
  {
    path: 'password',
    loadChildren: () => import('./password/password.module').then( m => m.PasswordPageModule)
  },
  {
    path: 'ask-payment-way',
    loadChildren: () => import('./ask-payment-way/ask-payment-way.module').then( m => m.AskPaymentWayPageModule)
  },
  {
    path: 'welcome-user',
    loadChildren: () => import('./welcome-user/welcome-user.module').then( m => m.WelcomeUserPageModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./tracking/tracking.module').then( m => m.TrackingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
