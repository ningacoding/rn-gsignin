package com.reactnativegooglesignin;

import android.util.Log;

import com.facebook.react.bridge.Promise;


public class PromiseWrapper {
    private Promise promise;
    private String nameOfCallInProgress;
    public static final String ASYNC_OP_IN_PROGRESS = "ASYNC_OP_IN_PROGRESS";
    private final String MODULE_NAME;

    public PromiseWrapper(String moduleName) {
        MODULE_NAME = moduleName;
    }

    public void setPromiseWithInProgressCheck(Promise promise, String fromCallsite) {
        if (this.promise != null) {
            rejectPreviousPromiseBecauseNewOneIsInProgress(this.promise, fromCallsite);
        }
        this.promise = promise;
        nameOfCallInProgress = fromCallsite;
    }

    public void resolve(Object value) {
        Promise resolver = promise;
        if (resolver == null) {
            Log.w(MODULE_NAME, "cannot resolve promise because it's null");
            return;
        }

        resetMembers();
        resolver.resolve(value);
    }

    public void reject(String message) {
        Promise rejecter = promise;
        String currentNameOfCallInProgress = nameOfCallInProgress;
        if (rejecter == null) {
            Log.w(MODULE_NAME, "cannot reject promise because it's null");
            return;
        }

        resetMembers();
        rejecter.reject(currentNameOfCallInProgress, message);
    }
    public void reject(Exception e) {
        Promise rejecter = promise;
        String currentNameOfCallInProgress = nameOfCallInProgress;
        if (rejecter == null) {
            Log.w(MODULE_NAME, "cannot reject promise because it's null");
            return;
        }
        ErrorDto dto = new ErrorDto(e, currentNameOfCallInProgress);

        resetMembers();
        rejecter.reject(dto.getCode(), dto.getMessage(), e);
    }

    public void reject(IGetsErrorDetails getsErrorDetails) {
        Promise rejecter = promise;
        if (rejecter == null) {
            Log.w(MODULE_NAME, "cannot reject promise because it's null");
            return;
        }

        ErrorDto dto = getsErrorDetails.getErrorDto();

        resetMembers();
        rejecter.reject(dto.getCode(), dto.getMessage());
    }

    public String getNameOfCallInProgress(){
        return nameOfCallInProgress;
    }

    private void resetMembers() {
        nameOfCallInProgress = null;
        promise = null;
    }

    private void rejectPreviousPromiseBecauseNewOneIsInProgress(Promise promise, String requestedOperation) {
        promise.reject(ASYNC_OP_IN_PROGRESS, "Warning: previous promise did not settle and was overwritten. " +
          "You've called \"" + requestedOperation + "\" while \"" + getNameOfCallInProgress() + "\" was already in progress and has not completed yet.");
    }
}
