#import "CryptoBindings.h"
#import "Crypto.h"
#import <React/RCTLog.h>
#include <sys/sysctl.h>
#import "BCHelpers.h"

@implementation Crypto

// The React Native bridge needs to know our module
RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_METHOD(pbkdf2:(NSString *)password:(NSString *)salt:(int)iterations:(int)bits:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {

    const char* utf8String = pbkdf2_derive(
        [password UTF8String],
        [salt UTF8String],
        iterations,
        bits
    );

    if (utf8String) {
        resolve([NSString stringWithUTF8String:utf8String]);
    } else {
        reject(
            @"pbkdf2_failed",
            @"Key Derivation failed.",
            [BCHelpers newErrorObject]
        );
    }
}

RCT_EXPORT_METHOD(encryptText:(NSString *)data:(NSString *)key:(NSString *)salt:(NSString *)ivHex:(NSString *)hmacHexKey:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {

    const char* encryptedText = encrypt_cbc(
        [data UTF8String],
        [key UTF8String],
        [salt UTF8String],
        [ivHex UTF8String],
        [hmacHexKey UTF8String]
    );

    if (encryptedText) {
        resolve([NSString stringWithUTF8String:encryptedText]);
    } else {
        reject(
            @"encryption_failed",
            @"Encryption failed.",
            [BCHelpers newErrorObject]
        );
    }
}

RCT_EXPORT_METHOD(decryptText:(NSString *)data:(NSString *)key:(NSString *)ivHex:(NSString *)salt:(NSString *)hmacHexKey:(NSString *)hmacHex:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {
    const char* decryptedText = decrypt_cbc(
        [data UTF8String],
        [key UTF8String],
        [ivHex UTF8String],
        [salt UTF8String],
        [hmacHexKey UTF8String],
        [hmacHex UTF8String]
    );

    if (decryptedText) {
        resolve([NSString stringWithUTF8String:decryptedText]);
    } else {
        reject(
            @"decryption_failed",
            @"Decryption failed. The archive is possibly tampered with.",
            [BCHelpers newErrorObject]
        );
    }
}

RCT_EXPORT_METHOD(generateUUIDs:(int)count:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {
    const char* uuidList = generate_uuid_list(count);

    if (uuidList) {
        resolve([NSString stringWithUTF8String:uuidList]);
    } else {
        reject(
            @"uuid_generation_failed",
            @"Generating UUIDs failed.",
            [BCHelpers newErrorObject]
        );
    }
}

RCT_EXPORT_METHOD(generateSaltWithLength:(int)length:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {
    const char* salt = generate_salt(length);

    if (salt) {
        resolve([NSString stringWithUTF8String:salt]);
    } else {
        reject(
            @"salt_generation_failed",
            @"Generating Salt failed.",
            [BCHelpers newErrorObject]
        );
    }
}

RCT_EXPORT_METHOD(generateIV:(RCTPromiseResolveBlock)resolve:(RCTPromiseRejectBlock)reject) {
    const char* iv = generate_random_bytes();

    if (iv) {
        resolve([NSString stringWithUTF8String:iv]);
    } else {
        reject(
            @"iv_generation_failed",
            @"Generating IV failed.",
            [BCHelpers newErrorObject]
        );
    }
}

@end
