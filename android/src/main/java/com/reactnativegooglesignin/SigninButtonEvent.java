package com.reactnativegooglesignin;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

public class SigninButtonEvent extends Event<SigninButtonEvent> {
    public static final String EVENT_NAME = "topOnPress";
    public SigninButtonEvent(int surfaceId, int reactTag) {
        super(surfaceId, reactTag);
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    protected WritableMap getEventData() {
      return Arguments.createMap();
    }
}
