// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  passphrase: '752496As5sdGT?=5a6ZX',
  AESiv: '100a101000111101100101AFde',
  paths: {
    base_api: 'http://localhost:5000/v2/api/',//'https://3coapp.click/v2/api/',
    base_detection_api: 'http://localhost:5000/v2/api/',//'https://3coapp.click/v2/api/',
    post_get_user: 'user',
    register: 'user/register',
    login: 'user/login',
    guest: 'guest/',
    migrateGuest: '/register',
    products: '3co/products',
    reviews: '3co/reviews',
    recover: 'user/password_recovery',
    verification: 'user/verify_email',
    user_resend: 'user/resend_verification'
  }
};
