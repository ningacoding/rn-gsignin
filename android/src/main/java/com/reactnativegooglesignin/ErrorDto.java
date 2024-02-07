package com.reactnativegooglesignin;

import com.google.android.gms.auth.api.signin.GoogleSignInStatusCodes;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.UnsupportedApiCallException;

public class ErrorDto {
    private String code;
    private String message;

    public ErrorDto(Exception e, String errCodeFallback) {
        // Google's exceptions are not very helpful and error codes can be context-sensitive
        String localizedMessage = e.getLocalizedMessage() != null ? e.getLocalizedMessage() : e.getMessage();
        if (e instanceof ApiException exception) {
            int code = exception.getStatusCode();
            // we apply some heuristic to try make the error message more useful
            int minLengthToBeInsightful = 10;
            boolean isInsightful = localizedMessage != null && localizedMessage.length() > minLengthToBeInsightful;
            // remove code from message, users don't want to see it and it's already present in the code field
            String errorDescription = isInsightful ? localizedMessage.replaceFirst(code + ": ", "") : GoogleSignInStatusCodes.getStatusCodeString(code);
            this.code = String.valueOf(code);
            this.message = errorDescription;
        } else if (e instanceof UnsupportedApiCallException) {
            this.code = errCodeFallback;
            this.message = localizedMessage + " Make sure you have the latest version of Google Play Services installed.";
        } else {
            this.code = errCodeFallback;
            this.message = localizedMessage;
        }
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
