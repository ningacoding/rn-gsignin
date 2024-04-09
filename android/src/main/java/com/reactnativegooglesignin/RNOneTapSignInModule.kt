package com.reactnativegooglesignin

import androidx.credentials.ClearCredentialStateRequest
import androidx.credentials.CredentialManager
import androidx.credentials.CredentialOption
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetCredentialResponse
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import androidx.credentials.exceptions.NoCredentialException
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.google.android.gms.auth.api.signin.GoogleSignInStatusCodes
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.libraries.identity.googleid.GoogleIdTokenParsingException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class RNOneTapSignInModule(reactContext: ReactApplicationContext) :
  NativeOneTapSignInSpec(reactContext) {
  private val credentialManager: CredentialManager =
    CredentialManager.create(reactApplicationContext)

  override fun explicitSignIn(params: ReadableMap, promise: Promise) {
    val explicitRequest = buildExplicitOneTapSignInRequest(params)
    signInInternal(explicitRequest, promise)
  }
  override fun signIn(params: ReadableMap, promise: Promise) {
    val googleIdOption = buildOneTapSignInRequest(params)
    signInInternal(googleIdOption, promise)
  }

  private fun signInInternal(credentialOption: CredentialOption, promise: Promise, ) {
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
            val userParams = Utils.getUserProperties(googleIdTokenCredential)
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
  }

  private fun buildOneTapSignInRequest(
    params: ReadableMap
  ): GetGoogleIdOption {
    val webClientId = params.getString("webClientId")!!
    val nonce = params.getString("nonce")
    val autoSignIn = params.getBoolean("autoSignIn")
    val filterByAuthorizedAccounts = params.getBoolean("filterByAuthorizedAccounts")
    return GetGoogleIdOption.Builder()
      .setFilterByAuthorizedAccounts(filterByAuthorizedAccounts)
      .setServerClientId(webClientId)
      .setNonce(nonce)
      .setAutoSelectEnabled(autoSignIn)
      .build()
  }
  private fun buildExplicitOneTapSignInRequest(
    params: ReadableMap
  ): GetSignInWithGoogleOption {
    val webClientId = params.getString("webClientId")!!
    val nonce = params.getString("nonce")
    return GetSignInWithGoogleOption.Builder(webClientId)
      .setNonce(nonce)
      .build()
  }
}
