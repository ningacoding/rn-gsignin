package com.reactnativegooglesignin

import android.app.Activity
import android.app.PendingIntent
import android.content.Intent
import android.content.IntentSender.SendIntentException
import androidx.core.app.ActivityCompat.startIntentSenderForResult
import androidx.credentials.ClearCredentialStateRequest
import androidx.credentials.CredentialManager
import androidx.credentials.CredentialOption
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetCredentialResponse
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import androidx.credentials.exceptions.NoCredentialException
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.google.android.gms.auth.api.identity.AuthorizationResult
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.auth.api.signin.GoogleSignInStatusCodes
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.libraries.identity.googleid.GoogleIdTokenParsingException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch


class RNOneTapSignInModule(reactContext: ReactApplicationContext) :
  NativeOneTapSignInSpec(reactContext) {
  private val credentialManager: CredentialManager =
    CredentialManager.create(reactApplicationContext)
  private val addScopesPromiseWrapper = PromiseWrapper(NAME)
  private val oneTapUtils = OneTapUtils.OneTapUtils(reactApplicationContext)

  private val activityEventListener =
    object : BaseActivityEventListener() {
      override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
      ) {
        if (requestCode != REQUEST_AUTHORIZE) {
          return
        }
        when (resultCode) {
          Activity.RESULT_OK -> {
            try {
              val authorizationResult =
                Identity.getAuthorizationClient(activity!!).getAuthorizationResultFromIntent(data)
              val result = authResultToJsMap(authorizationResult)
              addScopesPromiseWrapper.resolve(result)
            } catch (e: Exception) {
              addScopesPromiseWrapper.reject(e)
            }
          }

          Activity.RESULT_CANCELED -> {
            addScopesPromiseWrapper.reject(
              GoogleSignInStatusCodes.SIGN_IN_CANCELLED.toString(),
              "User cancelled the operation."
            )
          }

          else -> {
            addScopesPromiseWrapper.reject("Failed to add scopes.")
          }
        }
      }
    }

  init {
    reactContext.addActivityEventListener(activityEventListener)
  }

  override fun invalidate() {
    reactApplicationContext.removeActivityEventListener(activityEventListener)
    super.invalidate()
  }

  override fun explicitSignIn(params: ReadableMap, promise: Promise) {
    val explicitRequest = oneTapUtils.buildExplicitOneTapSignInRequest(params)
    signInInternal(explicitRequest, promise)
  }

  override fun signIn(params: ReadableMap, promise: Promise) {
    val googleIdOption = oneTapUtils.buildOneTapSignInRequest(params)
    signInInternal(googleIdOption, promise)
  }

  private fun signInInternal(credentialOption: CredentialOption, promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
      RNGoogleSigninModule.rejectWithNullActivity(promise)
      return
    }
    val request: GetCredentialRequest = GetCredentialRequest.Builder()
      .addCredentialOption(credentialOption)
      .build()

    CoroutineScope(Dispatchers.IO).launch {
      try {
        val result = credentialManager.getCredential(
          request = request,
          context = activity,
        )
        handleSignInSuccess(result, promise)
      } catch (e: GetCredentialException) {
        handleSignInError(e, promise)
      }
    }
  }

  private fun handleSignInError(e: GetCredentialException, promise: Promise) {
    when (e) {
      is GetCredentialCancellationException -> {
        promise.reject(GoogleSignInStatusCodes.SIGN_IN_CANCELLED.toString(), e.message, e)
      }

      is NoCredentialException -> {
        if (e.type == android.credentials.GetCredentialException.TYPE_NO_CREDENTIAL) {
          if (e.message?.contains("too many canceled sign-in prompts") == true) {
            promise.reject(ONE_TAP_START_FAILED, e.message, e)
          } else {
            promise.reject(NO_SAVED_CREDENTIAL_FOUND, e.message, e)
          }
        } else {
          promise.reject(e.type, e.message, e)
        }
      }

      else -> {
        promise.reject(e.type, e.message, e)
      }
    }
  }

  private fun handleSignInSuccess(result: GetCredentialResponse, promise: Promise) {
    val credential = result.credential

    when (credential) {
      is CustomCredential -> {
        if (credential.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
          try {
            val googleIdTokenCredential = GoogleIdTokenCredential
              .createFrom(credential.data)
            val userParams = oneTapUtils.getUserProperties(googleIdTokenCredential)
            promise.resolve(userParams)
          } catch (e: GoogleIdTokenParsingException) {
            promise.reject(NAME, e)
          }
        } else {
          promise.reject(NAME, "Unexpected type of custom credential")
        }
      }

      else -> {
        promise.reject(NAME, "Unexpected type of credential")
      }
    }
  }

  override fun requestAuthorization(params: ReadableMap, promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
      RNGoogleSigninModule.rejectWithNullActivity(promise)
      return
    }
    // com.google.android.gms.common.Scopes can be used to get predefined scopes

    val authorizationRequest = oneTapUtils.buildAuthorizationRequest(params)

    Identity.getAuthorizationClient(activity)
      .authorize(authorizationRequest)
      .addOnSuccessListener { authorizationResult ->
        if (authorizationResult.hasResolution()) {
          // Access needs to be granted by the user
          val pendingIntent: PendingIntent = authorizationResult.pendingIntent!!
          try {
            addScopesPromiseWrapper.setPromiseWithInProgressCheck(promise, "addScopes")
            startIntentSenderForResult(
              activity,
              pendingIntent.intentSender,
              REQUEST_AUTHORIZE, null, 0, 0, 0, null
            )
          } catch (e: SendIntentException) {
            promise.reject("requestAuthorization", "Couldn't start Authorization UI: " + e.localizedMessage, e)
          }
        } else {
          val ret = authResultToJsMap(authorizationResult)
          promise.resolve(ret)
        }
      }
      .addOnFailureListener { e ->
        promise.reject("requestAuthorization", e)
      }
  }

  private fun authResultToJsMap(authorizationResult: AuthorizationResult): WritableMap {
    val accessToken = authorizationResult.accessToken
    val serverAuthCode = authorizationResult.serverAuthCode
    val grantedScopes = authorizationResult.grantedScopes

    val ret = Arguments.createMap()
    ret.putString("accessToken", accessToken)
    ret.putString("serverAuthCode", serverAuthCode)
    ret.putArray("grantedScopes", Arguments.fromList(grantedScopes))
    return ret
  }

  override fun signOut(promise: Promise) {
    CoroutineScope(Dispatchers.IO).launch {
      try {
        credentialManager.clearCredentialState(ClearCredentialStateRequest())
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("signOut", e)
      }
    }
  }

  companion object {
    const val ONE_TAP_START_FAILED = "ONE_TAP_START_FAILED"
    const val NO_SAVED_CREDENTIAL_FOUND = "NO_SAVED_CREDENTIAL_FOUND"
    const val REQUEST_AUTHORIZE = 9002
  }
}
