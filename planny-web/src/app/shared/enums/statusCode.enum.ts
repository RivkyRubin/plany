export enum ApiResponseCode
{
    EmailNotConfirmed = 1,
    UserNowFound = 2,
    InvalidUserNameOrPassword=3,
    UserLogedInWithExternalProvider=4,
    ErrorSendingEmail = 5,
    ResetPasswordFailed=6,
    ResetPasswordLinkExpirted = 7
}