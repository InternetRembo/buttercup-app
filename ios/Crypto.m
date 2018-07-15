#import "CryptoBindings.h"
#import "CryptoBridge.h"
#import "BCHelpers.h"
#include <sys/sysctl.h>
#import <React/RCTLog.h>

#import "Crypto.h"

@implementation Crypto

+ (NSString *)encryptText:(NSString *)text usingKey:(NSString *)keyHex andSalt:(NSString *)salt andIV:(NSString *)ivHex andHMACKey:(NSString *)hmacKeyHex {
    const char* encryptedText = encrypt_cbc(
        [text UTF8String],
        [keyHex UTF8String],
        [salt UTF8String],
        [ivHex UTF8String],
        [hmacKeyHex UTF8String]
    );
    NSString *output = [NSString stringWithUTF8String:encryptedText];
    dealloc_memory(encryptedText);
    return output;
}

+ (NSString *)pbkdf2UsingPassword:(NSString *)password andSalt:(NSString *)salt andIterations:(int)iterations andBits:(int)bits {
    const char* keyDerivationInfo = pbkdf2_derive(
        [password UTF8String],
        [salt UTF8String],
        iterations,
        bits
    );
    NSString *output = [NSString stringWithUTF8String:keyDerivationInfo];
    dealloc_memory(keyDerivationInfo);
    return output;
}

@end
