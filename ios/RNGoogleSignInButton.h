#import <GoogleSignIn/GoogleSignIn.h>
#import <React/RCTComponent.h>

#ifdef RCT_NEW_ARCH_ENABLED
  #import <React/RCTViewComponentView.h>
#endif

@interface RNGoogleSignInButton :
#ifdef RCT_NEW_ARCH_ENABLED
  RCTViewComponentView
#else
#if !TARGET_OS_OSX
  GIDSignInButton
#else
  NSObject
#endif // !TARGET_OS_OSX
#endif // RCT_NEW_ARCH_ENABLED

@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@end
