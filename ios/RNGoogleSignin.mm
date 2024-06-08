#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <GoogleSignIn/GoogleSignIn.h>
#import "RNGoogleSignin.h"

@interface RNGoogleSignin ()

@property (nonatomic) NSArray *scopes;
@property (nonatomic) NSUInteger profileImageSize;

@end

@implementation RNGoogleSignin

RCT_EXPORT_MODULE();

static NSString *const PLAY_SERVICES_NOT_AVAILABLE = @"PLAY_SERVICES_NOT_AVAILABLE";
static NSString *const ASYNC_OP_IN_PROGRESS = @"ASYNC_OP_IN_PROGRESS";

static NSString *const NO_SAVED_CREDENTIAL_FOUND = @"NO_SAVED_CREDENTIAL_FOUND";
static NSString *const ONE_TAP_START_FAILED = @"ONE_TAP_START_FAILED";

// The key in `GoogleService-Info.plist` client id.
// For more see https://developers.google.com/identity/sign-in/ios/start
static NSString *const kClientIdKey = @"CLIENT_ID";

typedef struct {
    NSString *clientId;
    NSString *webClientId;
} ClientConfiguration;

- (NSDictionary *)constantsToExport
{
  return @{
#if !TARGET_OS_OSX
           @"BUTTON_SIZE_ICON": @(kGIDSignInButtonStyleIconOnly),
           @"BUTTON_SIZE_STANDARD": @(kGIDSignInButtonStyleStandard),
           @"BUTTON_SIZE_WIDE": @(kGIDSignInButtonStyleWide),
#else
           @"BUTTON_SIZE_STANDARD": @(0),
           @"BUTTON_SIZE_WIDE": @(1),
           @"BUTTON_SIZE_ICON": @(2),
#endif
           @"SIGN_IN_CANCELLED": [@(kGIDSignInErrorCodeCanceled) stringValue],
           @"SIGN_IN_REQUIRED": [@(kGIDSignInErrorCodeHasNoAuthInKeychain) stringValue],
           @"SCOPES_ALREADY_GRANTED": [@(kGIDSignInErrorCodeScopesAlreadyGranted) stringValue],
           @"IN_PROGRESS": ASYNC_OP_IN_PROGRESS,
           // these never happen on iOS
           PLAY_SERVICES_NOT_AVAILABLE: PLAY_SERVICES_NOT_AVAILABLE,
           NO_SAVED_CREDENTIAL_FOUND: NO_SAVED_CREDENTIAL_FOUND,
           ONE_TAP_START_FAILED: ONE_TAP_START_FAILED,
           };
}

#ifdef RCT_NEW_ARCH_ENABLED
- (facebook::react::ModuleConstants<JS::NativeGoogleSignin::Constants>)getConstants {
  return facebook::react::typedConstants<JS::NativeGoogleSignin::Constants>(
          {
#if !TARGET_OS_OSX
                  .BUTTON_SIZE_ICON = kGIDSignInButtonStyleIconOnly,
                  .BUTTON_SIZE_STANDARD = kGIDSignInButtonStyleStandard,
                  .BUTTON_SIZE_WIDE = kGIDSignInButtonStyleWide,
#else
                  .BUTTON_SIZE_STANDARD = 0,
                  .BUTTON_SIZE_WIDE = 1,
                  .BUTTON_SIZE_ICON = 2,
#endif
                  .SIGN_IN_CANCELLED = [@(kGIDSignInErrorCodeCanceled) stringValue],
                  .SIGN_IN_REQUIRED = [@(kGIDSignInErrorCodeHasNoAuthInKeychain) stringValue],
                  .IN_PROGRESS = ASYNC_OP_IN_PROGRESS,
                  .SCOPES_ALREADY_GRANTED = [@(kGIDSignInErrorCodeScopesAlreadyGranted) stringValue],

                  // these never happen on iOS
                  .PLAY_SERVICES_NOT_AVAILABLE = PLAY_SERVICES_NOT_AVAILABLE,
                  .NO_SAVED_CREDENTIAL_FOUND = NO_SAVED_CREDENTIAL_FOUND,
                  .ONE_TAP_START_FAILED = ONE_TAP_START_FAILED,
          });
}
#endif

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_METHOD(configure:(NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  NSError *error;
  ClientConfiguration config = [self readConfigurationWithOptions:options error:&error];

  if (error) {
    RCTLogError(@"RNGoogleSignin: %@", error.localizedDescription);
    reject(@"configure", error.localizedDescription, error);
    return;
  }

  GIDConfiguration* googleConfig = [[GIDConfiguration alloc] initWithClientID:config.clientId
                                                               serverClientID:config.webClientId
                                                                 hostedDomain:options[@"hostedDomain"]
                                                                  openIDRealm:options[@"openIDRealm"]];
  GIDSignIn.sharedInstance.configuration = googleConfig;

  _profileImageSize = 120;
  if (options[@"profileImageSize"]) {
    NSNumber* size = options[@"profileImageSize"];
    _profileImageSize = size.unsignedIntegerValue;
  }

  _scopes = options[@"scopes"];

  resolve([NSNull null]);
}

- (ClientConfiguration)readConfigurationWithOptions:(NSDictionary *)options error:(NSError **)error {
  const ClientConfiguration emptyConfig = { nil, nil };

  NSString *webClientId = options[@"webClientId"];
  NSString *iosClientId = options[@"iosClientId"];

  BOOL shouldAttemptWebClientIdDetection = !webClientId || [@"autoDetect" isEqualToString:webClientId];
  if (!iosClientId || shouldAttemptWebClientIdDetection) {
    NSString *pathName = options[@"googleServicePlistPath"] ?: @"GoogleService-Info";
    NSURL *plistPath = [NSBundle.mainBundle URLForResource:pathName withExtension:@"plist"];
    if (!plistPath) {
      NSString *message = @"Failed to determine configuration: Either specify `iosClientId` (and optionally `offlineAccess: true, webClientId: xyz`) in configure(), or make sure that Firebase's GoogleService-Info.plist file is present in the project - if you use Firebase, download GoogleService-Info.plist file from Firebase and place it into the project. Read the iOS guide / Expo guide to learn more.";
      if (error) {
        *error = [NSError errorWithDomain:@"RNGoogleSignin" code:1001 userInfo:@{NSLocalizedDescriptionKey: message}];
      }
      return emptyConfig;
    }
    NSDictionary *plist = [[NSDictionary alloc] initWithContentsOfURL:plistPath error:error];
    if (*error) {
      return emptyConfig;
    }
    iosClientId = iosClientId ?: plist[kClientIdKey];
    webClientId = plist[@"WEB_CLIENT_ID"];
    BOOL offlineAccessRequested = [options[@"offlineAccess"] boolValue];
    if (offlineAccessRequested && !webClientId) {
      NSString *message = @"Successfully read GoogleService-Info.plist in order to determine 'webClientId' for offline access. However, the `WEB_CLIENT_ID` entry was not present in the file.";
      if (error) {
        *error = [NSError errorWithDomain:@"RNGoogleSignin" code:1002 userInfo:@{NSLocalizedDescriptionKey: message}];
      }
      return emptyConfig;
    }
  }
  const ClientConfiguration populatedConfig = { iosClientId, webClientId };
  return populatedConfig;
}


RCT_EXPORT_METHOD(signInSilently:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [GIDSignIn.sharedInstance restorePreviousSignInWithCompletion:^(GIDGoogleUser * _Nullable user, NSError * _Nullable error) {
    [self handleCompletion:user serverAuthCode:nil withError:error withResolver:resolve withRejector:reject fromCallsite:@"signInSilently"];
  }];
}

RCT_EXPORT_METHOD(signIn:(NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
      NSString* hint = options[@"loginHint"];
      NSArray* scopes = self.scopes;

#if !TARGET_OS_OSX
      [GIDSignIn.sharedInstance signInWithPresentingViewController:RCTPresentedViewController() hint:hint additionalScopes:scopes completion:^(GIDSignInResult * _Nullable signInResult, NSError * _Nullable error) {
          [self handleCompletion:signInResult withError:error withResolver:resolve withRejector:reject fromCallsite:@"signIn"];
      }];
#else
    [GIDSignIn.sharedInstance signInWithPresentingWindow:NSApplication.sharedApplication.mainWindow hint:hint additionalScopes:scopes completion:^(GIDSignInResult * _Nullable signInResult, NSError * _Nullable error) {
        [self handleCompletion:signInResult withError:error withResolver:resolve withRejector:reject fromCallsite:@"signIn"];
    }];
#endif
  });
}

RCT_EXPORT_METHOD(addScopes:(NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
      GIDGoogleUser *currentUser = GIDSignIn.sharedInstance.currentUser;
      if (!currentUser) {
        resolve([NSNull null]);
        return;
      }
      NSArray* scopes = options[@"scopes"];

#if !TARGET_OS_OSX
      [currentUser addScopes:scopes presentingViewController:RCTPresentedViewController() completion:^(GIDSignInResult * _Nullable signInResult, NSError * _Nullable error) {
          [self handleCompletion:signInResult withError:error withResolver:resolve withRejector:reject fromCallsite:@"addScopes"];
      }];
#else
    [currentUser addScopes:scopes presentingWindow:NSApplication.sharedApplication.mainWindow completion:^(GIDSignInResult * _Nullable signInResult, NSError * _Nullable error) {
        [self handleCompletion:signInResult withError:error withResolver:resolve withRejector:reject fromCallsite:@"addScopes"];
    }];
#endif
  });
}

RCT_EXPORT_METHOD(signOut:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [GIDSignIn.sharedInstance signOut];
  resolve([NSNull null]);
}

RCT_EXPORT_METHOD(revokeAccess:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [GIDSignIn.sharedInstance disconnectWithCompletion:^(NSError * _Nullable error) {
    if (error) {
      [RNGoogleSignin rejectWithSigninError:error withRejector:reject];
    } else {
      resolve([NSNull null]);
    }
  }];
}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSNumber *, hasPreviousSignIn)
{
  BOOL hasPreviousSignIn = [GIDSignIn.sharedInstance hasPreviousSignIn];
  return @(hasPreviousSignIn);
}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSDictionary*, getCurrentUser)
{
  GIDGoogleUser *currentUser = GIDSignIn.sharedInstance.currentUser;
  return RCTNullIfNil([self createUserDictionary:currentUser serverAuthCode:nil]);
}

RCT_EXPORT_METHOD(getTokens:(RCTPromiseResolveBlock)resolve
                    reject:(RCTPromiseRejectBlock)reject)
{
  GIDGoogleUser *currentUser = GIDSignIn.sharedInstance.currentUser;
  if (currentUser == nil) {
    reject(@"getTokens", @"getTokens requires a user to be signed in", nil);
    return;
  }
  [currentUser refreshTokensIfNeededWithCompletion:^(GIDGoogleUser * _Nullable user, NSError * _Nullable error) {
    if (error) {
      [RNGoogleSignin rejectWithSigninError:error withRejector:reject];
    } else {
      if (user) {
        resolve(@{
                  @"idToken" : user.idToken.tokenString,
                  @"accessToken" : user.accessToken.tokenString,
                  });
      } else {
        reject(@"getTokens", @"user was null", nil);
      }
    }
  }];
}

- (NSDictionary*)createUserDictionary: (nullable GIDSignInResult *) result {
  return [self createUserDictionary:result.user serverAuthCode:result.serverAuthCode];
}

- (NSDictionary*)createUserDictionary: (nullable GIDGoogleUser *) user serverAuthCode: (nullable NSString*) serverAuthCode {
  if (!user) {
    return nil;
  }
  NSURL *imageURL = user.profile.hasImage ? [user.profile imageURLWithDimension:_profileImageSize] : nil;

  NSDictionary *userInfo = @{
                             @"id": user.userID,
                             @"name": RCTNullIfNil(user.profile.name),
                             @"givenName": RCTNullIfNil(user.profile.givenName),
                             @"familyName": RCTNullIfNil(user.profile.familyName),
                             @"photo": imageURL ? imageURL.absoluteString : [NSNull null],
                             @"email": user.profile.email,
                             };

  NSDictionary *params = @{
                           @"user": userInfo,
                           @"idToken": user.idToken.tokenString,
                           @"serverAuthCode": RCTNullIfNil(serverAuthCode),
                           @"scopes": user.grantedScopes,
                           };
  return params;
}

- (void)handleCompletion: (GIDSignInResult * _Nullable) signInResult withError: (NSError * _Nullable) error withResolver: (RCTPromiseResolveBlock) resolve withRejector: (RCTPromiseRejectBlock) reject fromCallsite: (NSString *) from {
  [self handleCompletion:signInResult.user serverAuthCode:signInResult.serverAuthCode withError:error withResolver:resolve withRejector:reject fromCallsite:from];
}

- (void)handleCompletion: (GIDGoogleUser * _Nullable) user serverAuthCode: (nullable NSString*) serverAuthCode withError: (NSError * _Nullable) error withResolver: (RCTPromiseResolveBlock) resolve withRejector: (RCTPromiseRejectBlock) reject fromCallsite: (NSString *) from {
  if (error) {
    [RNGoogleSignin rejectWithSigninError:error withRejector:reject];
  } else {
    if (user) {
      resolve([self createUserDictionary:user serverAuthCode:serverAuthCode]);
    } else {
      reject(from, @"user was null", nil);
    }
  }
}

+ (void)rejectWithSigninError: (NSError *) error withRejector: (RCTPromiseRejectBlock) reject {
  NSString *errorMessage = @"Unknown error in google sign in.";
  switch (error.code) {
    case kGIDSignInErrorCodeUnknown:
      errorMessage = @"Unknown error in google sign in.";
      break;
    case kGIDSignInErrorCodeKeychain:
      errorMessage = @"A problem reading or writing to the application keychain.";
      break;
    case kGIDSignInErrorCodeHasNoAuthInKeychain:
      errorMessage = @"The user has never signed in before, or they have since signed out.";
      break;
    case kGIDSignInErrorCodeCanceled:
      errorMessage = @"The user canceled the sign in request.";
      break;
    case kGIDSignInErrorCodeEMM:
      errorMessage = @"An Enterprise Mobility Management related error has occurred.";
      break;
    case kGIDSignInErrorCodeScopesAlreadyGranted:
      errorMessage = @"The requested scopes have already been granted to the `currentUser`";
      break;
    case kGIDSignInErrorCodeMismatchWithCurrentUser:
      errorMessage = @"There was an operation on a previous user.";
      break;
  }
  NSString* message = [NSString stringWithFormat:@"RNGoogleSignIn: %@, %@", errorMessage, error.description];
  NSString* errorCode = [NSString stringWithFormat:@"%ld", error.code];
  reject(errorCode, message, error);
}

#ifdef RCT_NEW_ARCH_ENABLED

- (void)playServicesAvailable:(BOOL)showPlayServicesUpdateDialog resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    // never called on ios
    resolve(@(YES));
}

- (void)clearCachedAccessToken:(NSString *)tokenString resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    // never called on ios
    resolve([NSNull null]);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
   (const facebook::react::ObjCTurboModule::InitParams &)params
{
   return std::make_shared<facebook::react::NativeGoogleSigninSpecJSI>(params);
}
#endif

@end
