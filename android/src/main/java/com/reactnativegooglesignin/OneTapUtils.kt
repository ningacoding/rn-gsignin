package com.reactnativegooglesignin

import android.accounts.Account
import com.auth0.android.jwt.JWT
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.google.android.gms.auth.api.identity.AuthorizationRequest
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential

class OneTapUtils {

  class OneTapUtils(context: ReactApplicationContext) {
    private val detectedWebClientId: String? by lazy {
      // we could probably use some gradle magic to find if this value is present in the resources
      // but for now we'll do a runtime check
      val id: Int = context.resources
        .getIdentifier("default_web_client_id", "string", context.packageName)
      if (id != 0) {
        context.resources.getString(id)
      } else {
        null
      }
    }

    private fun getWebClientId(params: ReadableMap): String {
      val webClientId = if (!params.hasKey("webClientId") || "autoDetect" == params.getString("webClientId")) {
        this.detectedWebClientId
      } else {
        params.getString("webClientId")
      }
      return webClientId ?: throw IllegalArgumentException("webClientId is required but was not provided, " +
        "and not found in the Android resources. " +
        "To fix this, provide it in the params, or make sure you have set up Firebase correctly. " +
        "Read the Android guide / Expo guide to learn more.")
    }

    fun buildOneTapSignInRequest(
      params: ReadableMap,
    ): GetGoogleIdOption {
      val nonce = params.getString("nonce")
      val autoSignIn = params.getBoolean("autoSignIn")
      val filterByAuthorizedAccounts = params.getBoolean("filterByAuthorizedAccounts")

      return GetGoogleIdOption.Builder()
        .setServerClientId(getWebClientId(params))
        .setFilterByAuthorizedAccounts(filterByAuthorizedAccounts)
        .setNonce(nonce)
        .setAutoSelectEnabled(autoSignIn)
//        TODO, only for sign-ups
//         https://developers.google.com/identity/android-credential-manager/android/reference/com/google/android/libraries/identity/googleid/GetGoogleIdOption.Builder#setRequestVerifiedPhoneNumber(kotlin.Boolean)
//        .setRequestVerifiedPhoneNumber()
        .build()
    }

    fun buildExplicitOneTapSignInRequest(
      params: ReadableMap
    ): GetSignInWithGoogleOption {
      val nonce = params.getString("nonce")
      val hostedDomain = params.getString("hostedDomain")

      return GetSignInWithGoogleOption.Builder(getWebClientId(params)).apply {
          hostedDomain?.let { setHostedDomainFilter(it) }
          nonce?.let { setNonce(it) }
      }.build()
    }

    fun buildAuthorizationRequest(params: ReadableMap): AuthorizationRequest {
      val requestOfflineAccess = params.hasKey("webClientId")
      val hostedDomain = params.getString("hostedDomain")
      val accountName = params.getString("accountName")

      return AuthorizationRequest.builder().apply {
        setRequestedScopes(Utils.createScopesArray(params.getArray("scopes")).asList())
        if (requestOfflineAccess) {
          val serverClientId = getWebClientId(params)
          requestOfflineAccess(
            serverClientId,
            params.getBoolean("forceCodeForRefreshToken")
          )
        }

        hostedDomain?.let { filterByHostedDomain(it) }
        accountName?.let {
          val account = Account(it, "com.google")
          setAccount(account)
        }
      }.build()
    }

    fun getUserProperties(acct: GoogleIdTokenCredential): WritableMap {
      val photoUrl = acct.profilePictureUri
      val idToken = acct.idToken
      val email = acct.id

      val user = Arguments.createMap()
      user.putString("id", getSubjectId(acct))
      user.putString("email", email)
      user.putString("name", acct.displayName)
      user.putString("givenName", acct.givenName)
      user.putString("familyName", acct.familyName)
      user.putString("photo", photoUrl?.toString())

      val params = Arguments.createMap()
      params.putMap("user", user)
      params.putString("idToken", idToken)
      // credentialOrigin is not available on the Android side and is added for compatibility with web
      params.putString("credentialOrigin", "user")

      return params
    }

    private fun getSubjectId(acct: GoogleIdTokenCredential): String? {
      try {
        val token = acct.idToken
        val jwt = JWT(token)
        return jwt.subject
      } catch (e: Exception) {
        return acct.id
      }
    }
  }

}
