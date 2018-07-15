#import <XCTest/XCTest.h>
#import "Crypto.h"
#import <React/RCTLog.h>

@interface CryptoTests : XCTestCase

@end

@implementation CryptoTests

- (void)setUp {
    [super setUp];
    // Put setup code here. This method is called before the invocation of each test method in the class.
}

- (void)tearDown {
    // Put teardown code here. This method is called after the invocation of each test method in the class.
    [super tearDown];
}

- (void)testEncryptTextEncryptsData {
    NSString *targetData = @"Some test string";
    NSString *targetDataBase64 = [[targetData dataUsingEncoding:NSUTF8StringEncoding] base64EncodedStringWithOptions:0];
    NSString *keyHex = @"bbb74e51f675a663939f2e1eb1da33d2ad94003361dd458f935057f283ef7b4f";
    NSString *hmacKeyHex = @"67a128be346be974d4658600ac237b5fbebf558651693135aef39a3277f1e585";
    NSString *ivHex = @"f99d1b64511282e482cfc53cc856b5c2";
    NSString *salt = @"s%vK3-2#0";
    NSString *output = [Crypto encryptText:targetDataBase64 usingKey:keyHex andSalt:salt andIV:ivHex andHMACKey:hmacKeyHex];
    XCTAssertFalse([output containsString:targetDataBase64]);
    XCTAssertFalse([output containsString:targetData]);
    XCTAssertTrue([output length] > 0);
}

- (void)testEncryptTextPerformsReasonably {
    NSString *targetData = @"";
    for (int i = 0; i < 1000; i += 1) {
        targetData = [NSString stringWithFormat:@"Some test string. %@", targetData];
    }
    NSString *targetDataBase64 = [[targetData dataUsingEncoding:NSUTF8StringEncoding] base64EncodedStringWithOptions:0];
    NSString *keyHex = @"bbb74e51f675a663939f2e1eb1da33d2ad94003361dd458f935057f283ef7b4f";
    NSString *hmacKeyHex = @"67a128be346be974d4658600ac237b5fbebf558651693135aef39a3277f1e585";
    NSString *ivHex = @"f99d1b64511282e482cfc53cc856b5c2";
    NSString *salt = @"s%vK3-2#0";
    [self measureBlock:^{
        [Crypto encryptText:targetDataBase64 usingKey:keyHex andSalt:salt andIV:ivHex andHMACKey:hmacKeyHex];
    }];
}

- (void)testPbkdf2UsingPasswordGeneratesCorrectKey {
    NSString *output = [Crypto pbkdf2UsingPassword:@"test" andSalt:@"salt" andIterations:10000 andBits:512];
    XCTAssertTrue([output isEqualToString:@"d1605387b718397374bcfd7d87ef90b12c8ed1dc2ea2180f92bbc7810d5b9f1797aafe306c583fdd47e7252187148e257df7caf429268826ae1d7d4f89f0b469"]);
}

- (void)testPbkdf2UsingPasswordPerformsReasonably {
    [self measureBlock:^{
        [Crypto pbkdf2UsingPassword:@"testing" andSalt:@"salt" andIterations:300000 andBits:512];
    }];
}

@end
