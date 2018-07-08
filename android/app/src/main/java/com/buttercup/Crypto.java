package com.buttercup;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.net.URLDecoder;
import java.lang.String;

public class Crypto extends ReactContextBaseJavaModule {

    private static native String generateUUIDList(int count);
    private static native String deriveKeyFromPassword(String password, String salt, int rounds, int bits);
    private static native String generateSalt(int length);
    private static native String generateRandomBytes();

    static {
        System.loadLibrary("crypto");
    }

    public Crypto(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void pbkdf2(String password, String salt, int rounds, int bits, Promise promise) {
        String derivationHex = Crypto.deriveKeyFromPassword(password, salt, rounds, bits);
        promise.resolve(derivationHex);
    }

    @ReactMethod
    public void generateUUIDs(Promise promise) {
        String uuids = Crypto.generateUUIDList(10);
        promise.resolve(uuids);
    }

    @ReactMethod
    public void generateSaltWithLength(int length, Promise promise) {
        String salt = Crypto.generateSalt(length);
        promise.resolve(salt);
    }

    @ReactMethod
    public void generateIV(Promise promise) {
        String ivHex = Crypto.generateRandomBytes();
        promise.resolve(ivHex);
    }

    @Override
    public String getName() {
        return "Crypto";
    }

}
