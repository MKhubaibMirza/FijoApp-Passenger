import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ForwordGuard } from './forward.guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'home',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    canActivate: [AuthGuard],
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'profile',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'info',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./info/info.module').then(m => m.InfoPageModule)
  },
  {
    path: 'my-journeys',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./my-journeys/my-journeys.module').then(m => m.MyJourneysPageModule)
  },
  {
    path: 'payment-methods',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./payment-methods/payment-methods.module').then(m => m.PaymentMethodsPageModule)
  },
  {
    path: 'invite-friends',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./invite-friends/invite-friends.module').then(m => m.InviteFriendsPageModule)
  },
  {
    path: 'discount-codes',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./discount-codes/discount-codes.module').then(m => m.DiscountCodesPageModule)
  },
  {
    path: 'help',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./help/help.module').then(m => m.HelpPageModule)
  },
  {
    path: 'select-language',
    canActivate: [AuthGuard],
    loadChildren: () => import('./select-language/select-language.module').then(m => m.SelectLanguagePageModule)
  },
  {
    path: 'welcome-note',
    canActivate: [AuthGuard],
    loadChildren: () => import('./welcome-note/welcome-note.module').then(m => m.WelcomeNotePageModule)
  },
  {
    path: 'via-phone',
    canActivate: [AuthGuard],
    loadChildren: () => import('./via-phone/via-phone.module').then(m => m.ViaPhonePageModule)
  },
  {
    path: 'via-email',
    canActivate: [AuthGuard],
    loadChildren: () => import('./via-email/via-email.module').then(m => m.ViaEmailPageModule)
  },
  {
    path: 'otp-verification/:by/:data',
    canActivate: [AuthGuard],
    loadChildren: () => import('./otp-verification/otp-verification.module').then(m => m.OtpVerificationPageModule)
  },
  {
    path: 'password',
    canActivate: [AuthGuard],
    loadChildren: () => import('./password/password.module').then(m => m.PasswordPageModule)
  },
  {
    path: 'ask-payment-way',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./ask-payment-way/ask-payment-way.module').then(m => m.AskPaymentWayPageModule)
  },
  {
    path: 'welcome-user',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./welcome-user/welcome-user.module').then(m => m.WelcomeUserPageModule)
  },
  {
    path: 'tracking',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./tracking/tracking.module').then(m => m.TrackingPageModule)
  },
  {
    path: 'my-fav',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./my-fav/my-fav.module').then(m => m.MyFavPageModule)
  },
  {
    path: 'fav-dest',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./fav-dest/fav-dest.module').then(m => m.FavDestPageModule)
  },
  {
    path: 'fav-drivers',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./fav-drivers/fav-drivers.module').then(m => m.FavDriversPageModule)
  },
  {
    path: 'my-preferences',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./my-preferences/my-preferences.module').then(m => m.MyPreferencesPageModule)
  },
  {
    path: 'call-preference',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./call-preference/call-preference.module').then(m => m.CallPreferencePageModule)
  },
  {
    path: 'ac-preference',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./ac-preference/ac-preference.module').then(m => m.AcPreferencePageModule)
  },
  {
    path: 'open-door-preference',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./open-door-preference/open-door-preference.module').then(m => m.OpenDoorPreferencePageModule)
  },
  {
    path: 'conversation-preference',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./conversation-preference/conversation-preference.module').then(m => m.ConversationPreferencePageModule)
  },
  {
    path: 'cancel-reason',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./cancel-reason/cancel-reason.module').then(m => m.CancelReasonPageModule)
  },
  {
    path: 'sure-to-cancel-payment-method',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./sure-to-cancel-payment-method/sure-to-cancel-payment-method.module').then(m => m.SureToCancelPaymentMethodPageModule)
  },
  {
    path: 'add-payment-method',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./add-payment-method/add-payment-method.module').then(m => m.AddPaymentMethodPageModule)
  },
  {
    path: 'rating',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./rating/rating.module').then( m => m.RatingPageModule)
  },
  {
    path: 'forgot-password',
    canActivate: [AuthGuard],
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'journey-details',
    canActivate: [ForwordGuard],
    loadChildren: () => import('./journey-details/journey-details.module').then( m => m.JourneyDetailsPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
