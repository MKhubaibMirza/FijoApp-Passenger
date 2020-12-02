import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'home',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./info/info.module').then(m => m.InfoPageModule)
  },
  {
    path: 'my-journeys',
    loadChildren: () => import('./my-journeys/my-journeys.module').then(m => m.MyJourneysPageModule)
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./payment-methods/payment-methods.module').then(m => m.PaymentMethodsPageModule)
  },
  {
    path: 'invite-friends',
    loadChildren: () => import('./invite-friends/invite-friends.module').then(m => m.InviteFriendsPageModule)
  },
  {
    path: 'discount-codes',
    loadChildren: () => import('./discount-codes/discount-codes.module').then(m => m.DiscountCodesPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then(m => m.HelpPageModule)
  },
  {
    path: 'select-language',
    loadChildren: () => import('./select-language/select-language.module').then(m => m.SelectLanguagePageModule)
  },
  {
    path: 'welcome-note',
    loadChildren: () => import('./welcome-note/welcome-note.module').then(m => m.WelcomeNotePageModule)
  },
  {
    path: 'via-phone',
    loadChildren: () => import('./via-phone/via-phone.module').then(m => m.ViaPhonePageModule)
  },
  {
    path: 'via-email',
    loadChildren: () => import('./via-email/via-email.module').then(m => m.ViaEmailPageModule)
  },
  {
    path: 'otp-verification/:by/:data',
    loadChildren: () => import('./otp-verification/otp-verification.module').then(m => m.OtpVerificationPageModule)
  },
  {
    path: 'password',
    loadChildren: () => import('./password/password.module').then(m => m.PasswordPageModule)
  },
  {
    path: 'ask-payment-way',
    loadChildren: () => import('./ask-payment-way/ask-payment-way.module').then(m => m.AskPaymentWayPageModule)
  },
  {
    path: 'welcome-user',
    loadChildren: () => import('./welcome-user/welcome-user.module').then(m => m.WelcomeUserPageModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./tracking/tracking.module').then(m => m.TrackingPageModule)
  },
  {
    path: 'my-fav',
    loadChildren: () => import('./my-fav/my-fav.module').then(m => m.MyFavPageModule)
  },
  {
    path: 'fav-dest',
    loadChildren: () => import('./fav-dest/fav-dest.module').then(m => m.FavDestPageModule)
  },
  {
    path: 'fav-drivers',
    loadChildren: () => import('./fav-drivers/fav-drivers.module').then(m => m.FavDriversPageModule)
  },
  {
    path: 'my-preferences',
    loadChildren: () => import('./my-preferences/my-preferences.module').then(m => m.MyPreferencesPageModule)
  },
  {
    path: 'call-preference',
    loadChildren: () => import('./call-preference/call-preference.module').then(m => m.CallPreferencePageModule)
  },
  {
    path: 'ac-preference',
    loadChildren: () => import('./ac-preference/ac-preference.module').then(m => m.AcPreferencePageModule)
  },
  {
    path: 'open-door-preference',
    loadChildren: () => import('./open-door-preference/open-door-preference.module').then(m => m.OpenDoorPreferencePageModule)
  },
  {
    path: 'conversation-preference',
    loadChildren: () => import('./conversation-preference/conversation-preference.module').then(m => m.ConversationPreferencePageModule)
  },
  {
    path: 'cancel-reason',
    loadChildren: () => import('./cancel-reason/cancel-reason.module').then(m => m.CancelReasonPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./splash/splash.module').then(m => m.SplashPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
